# Poop Warrior Filter
The open-sourced version of the toxicity filtering system being used on the **Poop Warrior** Discord bot at [discord.gg/irida](https://discord.gg/irida).

## How it works
The filter runs a discord message through four layers of detection. The moment that a layer detected something in a message, it will stop and return toxicity.

## Running the Tester
To use the tester, you require [Node.js](https://nodejs.org/en). and to run the tester use the following command
```
npm run ai-test
```

## Contribution
1. Fork the repo
2. Edit stuff in `Filter.js`, add the stuff that you want (that can help improve moderation)
3. You can also improve the tester that we have in `test-ai.js`
4. __**RUN. THE. TESTS.**__ This is to prevent regressions in the filtering system. Even the smallest regressions can cause issues inside the server.
5. Open a pull request, describe exactly what you have changed or added and why you did it.