/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx: ExecutionContext): Promise<Response> {
		const NUMBER_ATTEMPTS = 2500;
		let count = 0;

		let multiLauncher = 200;

		//I wasn't sure about how quickly the results were going to show. If we see the writes and reads below we'll know they've shown up in our CF metrics on that KV.

		await Promise.allSettled([
			env.TEST_KV.put('sample_1', 'one'),
			env.TEST_KV.put('sample_2', 'two'),
			env.TEST_KV.put('sample_3', 'three'),
			env.TEST_KV.put('sample_4', 'four'),
			env.TEST_KV.put('sample_5', 'five'),
		]);

		const success = await Promise.allSettled([
			env.TEST_KV.get('sample_1'),
			env.TEST_KV.get('sample_2'),
			env.TEST_KV.get('sample_3'),
			env.TEST_KV.get('sample_4'),
			env.TEST_KV.get('sample_5'),
		]);

		console.log(success);

		while (count < NUMBER_ATTEMPTS) {
			const promiseArray = [];

			for (let i = 0; i < multiLauncher; i++) {
				promiseArray.push(env.TEST_KV.get(crypto.randomUUID()));
			}

			const success = await Promise.allSettled(promiseArray);

			console.log(success[0]);
			console.log(success[40]);
			console.log(count);

			count += multiLauncher;

			//I don't want cloudflare to blacklist me or something for ABSOLUTELY NO REASON 👀👀👀, perhaps throttling will help?
			await sleep(100);
		}

		return new Response('Hello World!');
	},
} satisfies ExportedHandler<Env>;

function sleep(ms: number) {
	return new Promise((r) => setTimeout(r, ms));
}
