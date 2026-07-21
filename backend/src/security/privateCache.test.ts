import assert from "node:assert/strict";
import test from "node:test";
import type { NextFunction, Request, Response } from "express";
import { isPersonalResponsePath, privateResponseHeaders, setPrivateNoStore } from "../middlewares/privateResponse.js";

function responseDouble() {
  const headers = new Map<string, string>();
  return {
    headers,
    response: {
      setHeader(name: string, value: string) {
        headers.set(name.toLowerCase(), value);
      },
    } as unknown as Response,
  };
}

test("private cache headers use the required values", () => {
  const { headers, response } = responseDouble();
  setPrivateNoStore(response);
  assert.equal(headers.get("cache-control"), "private, no-store");
  assert.equal(headers.get("pragma"), "no-cache");
  assert.equal(headers.get("expires"), "0");
  assert.equal(headers.get("vary"), "Cookie, Authorization");
});

test("personal endpoints are protected before authentication and parsing", () => {
  for (const path of [
    "/api/auth/login",
    "/api/me/cases/case-1",
    "/api/complaint-templates/generate",
    "/api/complaint-drafts",
    "/api/reports",
    "/api/reviews/safety-scan",
    "/api/admin/audit-logs",
  ]) assert.equal(isPersonalResponsePath(path), true, path);
  assert.equal(isPersonalResponsePath("/api/directory"), false);
  assert.equal(isPersonalResponsePath("/api/apps"), false);
  assert.equal(isPersonalResponsePath("/api/authentic-public-page"), false);
});

test("any authenticated response is private even on a public route", () => {
  const { headers, response } = responseDouble();
  const request = { path: "/api/directory", user: { id: "user-1" } } as unknown as Request;
  let continued = false;
  privateResponseHeaders(request, response, (() => { continued = true; }) as NextFunction);
  assert.equal(continued, true);
  assert.equal(headers.get("cache-control"), "private, no-store");
  assert.equal(headers.get("pragma"), "no-cache");
  assert.equal(headers.get("expires"), "0");
});
