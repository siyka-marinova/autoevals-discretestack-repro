# Autoevals + DiscreteStack minimal repro

This repository reproduces intermittent Autoevals parser failures when using
DiscreteStack as an OpenAI-compatible provider.

## Problem

`LLMClassifierFromTemplate` intermittently fails with:

```txt
SyntaxError: Unexpected token '<', "<tool_call"... is not valid JSON
```

The same setup works consistently with direct OpenAI (`gpt-4.1-mini`).

## Setup

```bash
npm install
cp .env.example .env
```

Fill `.env` with your provider credentials.

## Run

```bash
npm test
```

Repeat multiple times to reproduce intermittent failures:

```bash
npx playwright test --repeat-each=5
```

## Expected

Stable pass/fail classifier responses.

## Actual

Some runs intermittently fail with Autoevals parser errors caused by
`<tool_call...>` responses.
