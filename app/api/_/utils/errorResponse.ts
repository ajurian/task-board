import "server-only";

import { NextResponse } from "next/server";

export const badRequestErrorResponse = <T>(data: T) =>
    NextResponse.json(data, { status: 400 });

export const unauthorizedErrorResponse = <T>(data: T) =>
    NextResponse.json(data, { status: 401 });

export const forbiddenErrorResponse = <T>(data: T) =>
    NextResponse.json(data, { status: 403 });

export const notFoundErrorResponse = <T>(data: T) =>
    NextResponse.json(data, { status: 404 });

export const unprocessableEntityErrorResponse = <T>(data: T) =>
    NextResponse.json(data, { status: 422 });
