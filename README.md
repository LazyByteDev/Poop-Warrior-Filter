# Poop Warrior Filter
The open sourced version of the toxicity filtering system being used on the **Poop Warrior** Discord bot at [discord.gg/irida](https://discord.gg/irida).

## Running the Tester
To use the tester, you require [Node.js](https://nodejs.org/en). and to run the tester use the following command
```
npm run ai-test
```
The tester will test everything across from toxicity, casual chat, slang/abbreviations, etc. The output of the tester should look like this:
```
Total Tests: 1139
Passed: 1130 (99.2%)
Failed: 9 (0.8%)
   - False Positives (blocked good): 0
   - False Negatives (allowed bad): 9
```
If there is failures, it will give a list of what phrases failed, what it expected and what it got.

## Limitations with the Filtering
Although there is a lot of positives with what I got so far, there is a few issues that I do want to fix sometime in the future.
- No context awareness. (The filtering system only scans a single message and does not get context causing it to potentially act irrationally)
- Regex Patterns (no Machine Learning). As of now, its only using Regex patterns to detect toxic language and not a trained model. Although its fast, it can easily be bypassed with the right words.

## Contribution
1. Fork the repo
2. Edit stuff in `Filter.js`, add the stuff that you want (that can help improve moderation)
3. You can also improve the tester that we have in `test-ai.js`
4. __**RUN. THE. TESTS.**__ This is to prevent regressions in the filtering system.
5. Open a pull request and let us know what you changed in the code.

## LICENSE
MIT.