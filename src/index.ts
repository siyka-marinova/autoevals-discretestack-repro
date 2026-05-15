import 'dotenv/config';
import { LLMClassifierFromTemplate } from 'autoevals';

const model = process.env.OPENAI_JUDGE_MODEL ?? 'gpt-4.1-mini';

type JudgeTemplateInput = {
  scenario: string;
  requiredCriteria: string;
  forbiddenCriteria: string;
};

const evaluator = LLMClassifierFromTemplate<JudgeTemplateInput>({
  name: 'VehicleLifecycleJudge',
  model,
  temperature: 0,
  useCoT: true,
  choiceScores: {
    pass: 1,
    fail: 0,
  },
  promptTemplate: `
You are a strict evaluator for AI assistant responses in automated tests.

Evaluate whether the assistant response satisfies the scenario.

Pass only if:
- every required criterion is satisfied
- no forbidden criterion is violated

Fail if:
- any required criterion is missing
- any forbidden criterion is present

Scenario:
{{scenario}}

Required criteria:
{{requiredCriteria}}

Forbidden criteria:
{{forbiddenCriteria}}

Assistant response:
{{output}}

Choose exactly one:
pass
fail
`,
});

async function run(): Promise<void> {
  const result = await evaluator({
    scenario: 'Vehicle reactivation',
    requiredCriteria: ['- Mentions CA5074AC', '- Clearly says the vehicle was reactivated'].join('\n'),
    forbiddenCriteria: ['- Asks for confirmation instead of confirming completed reactivation'].join('\n'),
    output: `
Vehicle CA5074AC (Volkswagen Passat) has been reactivated and is now available for bookings.
    `.trim(),
    expected: 'pass',
  });

  console.log('RESULT');
  console.log(JSON.stringify(result, null, 2));
}

run().catch((error) => {
  console.error('EVALUATION FAILED');
  console.error(error);
  process.exit(1);
});
