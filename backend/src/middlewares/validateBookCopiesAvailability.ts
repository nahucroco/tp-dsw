// src/middlewares/validateBookCopiesAvailability.ts
import type { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '@mikro-orm/core';
import { orm } from '../data/orm.js';
import { BookCopy } from '../models/BookCopy.js';
import { Loan } from '../models/Loan.js';

const em = orm.em;

export const validateBookCopiesAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = (req.body?.sanitizedInput ?? req.body) ?? {};
    const refs: Array<{ id: number }> = Array.isArray(body.bookCopies) ? body.bookCopies : [];

    if (!refs.length) {
      return res.status(400).json({ error: 'bookCopies must be an array' });
    }

    const requestedIds = refs.map(r => Number(r?.id)).filter(Number.isFinite);
    if (requestedIds.length !== refs.length) {
      return res.status(400).json({ error: 'Each book copy must have a numeric id' });
    }

    // ---- identificar préstamo que edito
    const paramId = Number.isFinite(+req.params?.id) ? +req.params.id : undefined;
    const bodyId  = Number.isFinite(+body?.id)        ? +body.id        : undefined;
    const loanId  = paramId ?? bodyId;

    // ---- traer copias que YA pertenecen al préstamo (permitidas aunque is_available=false)
    let currentCopyIds = new Set<number>();
    if (loanId) {
      const loan = await em.findOne(Loan, { id: loanId });
      if (loan) {
        await em.populate(loan, ['bookCopies']); // <— importante: populate explícito
        currentCopyIds = new Set(loan.bookCopies.getItems().map(c => c.id));
      }
    }

    // ---- traer las copias que me piden en este request
    const copies = await em.find(BookCopy, { id: { $in: requestedIds } });
    const foundIds = new Set(copies.map(c => c.id));
    const missing  = requestedIds.filter(id => !foundIds.has(id));
    if (missing.length) {
      return res.status(400).json({ error: 'Some book copies do not exist', missingIds: missing });
    }

    // ---- marcar indisponibles SOLO si no son del préstamo actual
    const unavailableIds = copies
      .filter(c => !c.is_available && !currentCopyIds.has(c.id))
      .map(c => c.id);

    if (unavailableIds.length) {
      return res.status(400).json({ error: 'Some book copies are not available', unavailableIds });
    }

    // (opcional) regla 1..3
    if (requestedIds.length < 1 || requestedIds.length > 3) {
      return res.status(400).json({ error: 'Loans must include between 1 and 3 book copies' });
    }

    next();
  } catch (e) {
    if (e instanceof NotFoundError) {
      return res.status(400).json({ error: 'book copy doesnt exist' });
    }
    console.error('validateBookCopiesAvailability error:', e);
    return res.status(500).json({ message: 'internal error' });
  }
};
