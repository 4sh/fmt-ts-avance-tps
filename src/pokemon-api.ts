const ERROR_RATIO_PERCENTS = 20; // 20% of the time, fetchRawPokemons() will fail
const FAKE_THROTTLING_DURATION_RANGE = { min: 500, max: 5000 }; // Request throttling between 500ms and 5s

function wait(durationInMs: number) {
  return new Promise(resolve => setTimeout(resolve, durationInMs));
}

export type FetchStatusUpdate =
  | { status: 'initiated' }
  | { status: 'loading', since: Date }
  | { status: 'completed', rawJson: string }
  | { status: 'error', errorMessage: string };

export async function fetchRawPokemons(onFetchStatusChanged: (update: FetchStatusUpdate) => Promise<void>): Promise<Extract<FetchStatusUpdate, { status: 'completed'|'error' }>> {
  return new Promise(async (resolve, reject) => {
    // Context starts from index.html (from where current script is imported)
    const TP_ROOT_PATH = `./`

    await onFetchStatusChanged({ status: 'initiated' })
    await wait(1000);

    await onFetchStatusChanged({ status: 'loading', since: new Date() })
    const resp = await fetch(`${TP_ROOT_PATH}data/pokemons.json`);

    const throttlingDuration = FAKE_THROTTLING_DURATION_RANGE.min + Math.random() * (FAKE_THROTTLING_DURATION_RANGE.max - FAKE_THROTTLING_DURATION_RANGE.min)
    await wait(throttlingDuration);
    if(Math.random() <= ERROR_RATIO_PERCENTS/100) {
      const errorPayload = { status: 'error', errorMessage: `An unexpected (fake) error occured while fetching pokemons !` } as const;
      await onFetchStatusChanged(errorPayload)
      reject(errorPayload);
      return;
    }

    const completedPayload = { status: 'completed', rawJson: await resp.json() } as const;
    await onFetchStatusChanged(completedPayload);
    resolve(completedPayload);
  })
}
