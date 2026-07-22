import assert from "node:assert/strict";
import { request as httpRequest } from "node:http";
import test from "node:test";
import express, { type NextFunction, type Request, type Response } from "express";
import {
  contentLengthExceeds,
  jsonRequestLimit,
  queryStringBytes,
  REQUEST_SIZE_LIMITS,
} from "../middlewares/requestSize.js";

test("endpoint limits remain substantially below the former 5 MB default", () => {
  assert.equal(REQUEST_SIZE_LIMITS.loginBytes, 16 * 1024);
  assert.equal(REQUEST_SIZE_LIMITS.signupBytes, 32 * 1024);
  assert.equal(REQUEST_SIZE_LIMITS.generalJsonBytes, 64 * 1024);
  assert.equal(REQUEST_SIZE_LIMITS.reviewBytes, 48 * 1024);
  assert.equal(REQUEST_SIZE_LIMITS.correctionBytes, 48 * 1024);
  assert.equal(REQUEST_SIZE_LIMITS.complaintDraftBytes, 128 * 1024);
  assert.ok(REQUEST_SIZE_LIMITS.searchQueryBytes <= 2 * 1024);
});

test("declared body and encoded query sizes are measured in bytes", () => {
  assert.equal(contentLengthExceeds("16385", 16 * 1024), true);
  assert.equal(contentLengthExceeds("16384", 16 * 1024), false);
  assert.equal(contentLengthExceeds("invalid", 16 * 1024), false);
  assert.equal(queryStringBytes("/search?q=%E2%82%AC"), Buffer.byteLength("q=%E2%82%AC"));
});

test("JSON parser rejects oversized chunked bodies without Content-Length", async () => {
  const miniApp = express();
  miniApp.post("/", ...jsonRequestLimit(1024), (_req, res) => res.status(204).send());
  miniApp.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    res.status((error as { status?: number }).status ?? 500).send();
  });
  const server = miniApp.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  try {
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Test server did not bind to TCP");
    const status = await new Promise<number>((resolve, reject) => {
      const req = httpRequest({
        host: "127.0.0.1",
        port: address.port,
        path: "/",
        method: "POST",
        headers: { "content-type": "application/json", "transfer-encoding": "chunked" },
      }, (res) => {
        res.resume();
        res.once("end", () => resolve(res.statusCode ?? 0));
      });
      req.once("error", reject);
      req.write(JSON.stringify({ text: "x".repeat(2_000) }));
      req.end();
    });
    assert.equal(status, 413);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});

test("a parsed endpoint-specific body is not rejected by a later general guard", async () => {
  const miniApp = express();
  miniApp.post("/", ...jsonRequestLimit(2_048), ...jsonRequestLimit(1_024), (_req, res) => res.status(204).send());
  miniApp.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    res.status((error as { status?: number }).status ?? 500).send();
  });
  const server = miniApp.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  try {
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Test server did not bind to TCP");
    const response = await fetch(`http://127.0.0.1:${address.port}/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: "x".repeat(1_500) }),
    });
    assert.equal(response.status, 204);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
