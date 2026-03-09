const ES_URL = "http://localhost:9200";
const KIBANA_URL = "http://localhost:5601";
const INDEX_NAME = "app-logs";

import { execSync } from "child_process";


// | correlationId | requestId | action | status | trace  |
// |---------------|-----------|--------|--------|------------|
// | keyword        | keyword    | keyword | keyword | JSON blob  |

// let res = await fetch(`${ELASTIC_ENDPOINT}/${INDEX_NAME}`, {
//   method: 'PUT',
//   body: JSON.stringify({
//     mappings: {
//       properties: {
//         correlationId: { type: 'keyword' },
//         requestId: { type: 'keyword' },
//         action: { type: 'keyword' },
//         status: { type: 'keyword' },
//         trace: { type: 'object' },
//       }
//     }
//   }),
//   headers: {
//     "Content-Type": "application/json",
//   }
// })

// console.log(res);

// res = await fetch('http://localhost:5601/api/data_views/data_view', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'kbn-xsrf': 'true'
//   },
//   body: JSON.stringify({
//     data_view: {
//       title: 'app-logs*',
//       name: 'App Logs',
//       timeFieldName: 'timestamp'
//     }
//   })
// });

// console.log(res);

async function indexExists(indexName) {
  console.log(`Checking if index ${indexName} already exists`);
  try {
    const res = await fetch(`${ES_URL}/${indexName}`, {
      method: 'HEAD',
    })

    // TODO: Modify this console log it is misleading
    console.log(`Index ${indexName} exists`);
    return res.ok
  } catch (e) {
    console.log(`Index doesn't ${indexName} exists`);
    return false
  }
}

async function createIndex() {
  console.log("Creating index...");
  // Just assuming this works tbh.
  await fetch(`${ES_URL}/${INDEX_NAME}`, {
    method: 'PUT',
    body: JSON.stringify({
      mappings: {
        properties: {
          correlationId: { type: 'keyword' },
          requestId: { type: 'keyword' },
          action: { type: 'keyword' },
          status: { type: 'keyword' },
          trace: { type: 'object' },
        },
      },
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log("Index created ✓");
}

async function dataViewExists(dataViewTitle) {
  console.log(`Checking if Data view: ${dataViewTitle}exists`);
  const res = await fetch(`${KIBANA_URL}/api/data_views`, {
    headers: { "kbn-xsrf": "true" }
  });

  const { data_view: dataViews } = await res.json();
  return dataViews.some(dataView => dataView.title === dataViewTitle);
}

async function createDataView() {
  console.log("Creating data view...");
  await fetch('http://localhost:5601/api/data_views/data_view', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'kbn-xsrf': 'true'
    },
    body: JSON.stringify({
      data_view: {
        title: 'app-logs*',
        name: 'App Logs',
        timeFieldName: 'timestamp'
      }
    })
  });
  console.log("Data view created ✓");
}

function isContainerRunning(containerName) {
  try {
    const result = execSync(`docker inspect --format="{{.State.Running}}" ${containerName}`)
      .toString()
      .trim()
    return result === "true";
  } catch (_) {
    // Ignoring the error, because otherwise we error when container is not
    // running which is what we are checking in the first place
    return false
  }
}

function startDockerContainers() {
  execSync("docker compose up -d", { stdio: "inherit" });
}

async function isServiceRunning(name, url, timeoutMs = 60000) {
  const start = Date.now();
  process.stdout.write(`Waiting for ${name}...`);

  while (Date.now() - start <= timeoutMs) {
    try {
      const res = await fetch(url);

      if (res.ok) {
        process.stdout.write('\n');
        console.log(`Service ${name} running ✓`);
        return true;
      }

      process.stdout.write('.');
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (_) {
      process.stdout.write('.');
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  return false;
}


async function main() {
  console.log("Setting up kibana and elastic containers...");

  // Check if containers already running, if not then start the containers.
  if (isContainerRunning("es-local-dev")) {
    console.log("Containers already running ✓");
  } else {
    console.log("Starting docker containers");
    startDockerContainers();
    console.log("Docker containers running ✓");
  }

  const results = await Promise.all([
    isServiceRunning("Elastic", `${ES_URL}/_cluster/health`),
    isServiceRunning("Kibana", `${KIBANA_URL}/api/status`)
  ]);

  // If one service isn't running throw error and quit.
  // NOTE: test this somehow, idk how to.
  if (results.some(res => res === false)) throw new Error("Not all services are running");

  // assuming that all services are up and running from this point forward
  if (!(await indexExists(INDEX_NAME))) {
    await createIndex();
  }

  if (!(await dataViewExists(INDEX_NAME + "*"))) {
    await createDataView();
  }

  console.log("Everything is set up ✓");
  console.log(`Go to ${KIBANA_URL} and login with \nUsername: elastic\nPassword: digW4eqj`);
}

main().catch((err) => {
  console.error("\nSetup failed:", err.message);
  process.exit(1);
});
