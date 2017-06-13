// Imports
import { expect } from 'chai';
import 'mocha';
import * as request from 'supertest';
import express = require("express");

// Imports app
import { ContentPredictorServiceApi } from './app';

let api;

describe('GET /api/hello/world', function() {

  beforeEach(() => {
     api = new ContentPredictorServiceApi(express(), 8000);
  });

  it('should respond with status code 200', (done: () => void) => {
    request(api.getApp())
      .get('/api/hello/world')
      .send()
      .expect(200, done);
  });
});
