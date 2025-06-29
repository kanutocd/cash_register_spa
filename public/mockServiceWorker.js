/* eslint-disable */
/* tslint:disable */

/**
 * Mock Service Worker.
 * @see https://github.com/mswjs/msw
 * - Please do NOT modify this file.
 * - Please do NOT serve this file on production.
 */

const INTEGRITY_CHECKSUM = "65d33ca82955e1c5928aed19d1bdf3f9";
const IS_MOCKED_RESPONSE = Symbol("isMockedResponse");
const activeClientIds = new Set();

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", async function (event) {
  const clientId = event.source.id;

  if (!clientId || !self.clients) {
    return;
  }

  const client = await self.clients.get(clientId);

  if (!client) {
    return;
  }

  const allClients = await self.clients.matchAll({
    type: "window",
  });

  switch (event.data.type) {
    case "KEEPALIVE_REQUEST": {
      sendToClient(client, {
        type: "KEEPALIVE_RESPONSE",
        payload: Date.now(),
      });
      break;
    }

    case "INTEGRITY_CHECK_REQUEST": {
      sendToClient(client, {
        type: "INTEGRITY_CHECK_RESPONSE",
        payload: INTEGRITY_CHECKSUM,
      });
      break;
    }

    case "MOCK_ACTIVATE": {
      activeClientIds.add(clientId);

      sendToClient(client, {
        type: "MOCKING_ENABLED",
        payload: true,
      });
      break;
    }

    case "MOCK_DEACTIVATE": {
      activeClientIds.delete(clientId);
      break;
    }

    case "CLIENT_CLOSED": {
      activeClientIds.delete(clientId);

      const remainingClients = allClients.filter((client) => {
        return client.id !== clientId;
      });

      // Unregister itself when there are no more clients
      if (remainingClients.length === 0) {
        self.registration.unregister();
      }

      break;
    }
  }
});

self.addEventListener("fetch", function (event) {
  const { request } = event;

  // Bypass navigation requests.
  if (request.mode === "navigate") {
    return;
  }

  // Opening the DevTools triggers the "only-if-cached" request
  // that cannot be handled by the worker. Bypass such requests.
  if (request.cache === "only-if-cached" && request.mode !== "same-origin") {
    return;
  }

  // Bypass all requests when there are no active clients.
  // Prevents the self-unregistered worked from handling requests
  // after it's been deleted (still remains active until the next reload).
  if (activeClientIds.size === 0) {
    return;
  }

  // Generate unique request ID.
  const requestId = Math.random().toString(16).slice(2);

  event.respondWith(
    handleRequest(event, requestId).catch((error) => {
      if (error.name === "NetworkError") {
        console.warn(
          'MSW: Successfully emulated a network error for the "%s %s" request.',
          request.method,
          request.url
        );
        return;
      }

      // At this point, any exception indicates an issue with the original request/response.
      console.error(
        `\
MSW: Caught an exception from the "%s %s" request (%s). This is probably not a problem with MSW. There is likely an additional logging output above.`,
        request.method,
        request.url,
        `${error.name}: ${error.message}`
      );
    })
  );
});

async function handleRequest(event, requestId) {
  const client = await self.clients.get(event.clientId);

  if (!client) {
    return passthrough(event.request);
  }

  return sendToClient(
    client,
    {
      type: "REQUEST",
      payload: {
        id: requestId,
        url: event.request.url,
        method: event.request.method,
        headers: Object.fromEntries(event.request.headers.entries()),
        cache: event.request.cache,
        mode: event.request.mode,
        credentials: event.request.credentials,
        destination: event.request.destination,
        integrity: event.request.integrity,
        redirect: event.request.redirect,
        referrer: event.request.referrer,
        referrerPolicy: event.request.referrerPolicy,
        body: await event.request.arrayBuffer(),
        bodyUsed: event.request.bodyUsed,
        keepalive: event.request.keepalive,
      },
    },
    event.waitUntil.bind(event)
  );
}

async function sendToClient(client, message, ...args) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();

    channel.port1.onmessage = function (event) {
      if (event.data && event.data.error) {
        return reject(event.data.error);
      }

      resolve(event.data);
    };

    client.postMessage(message, [channel.port2]);
  });
}

function passthrough(request) {
  const headers = Object.fromEntries(request.headers.entries());

  // Remove headers that will cause the request to fail
  delete headers["content-length"];

  return fetch(request.clone(), {
    headers,
  });
}

function sendToClient(client, message) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();

    channel.port1.onmessage = function (event) {
      if (event.data && event.data.error) {
        return reject(event.data.error);
      }

      resolve(event.data);
    };

    client.postMessage(message, [channel.port2]);
  });
}
