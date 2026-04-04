Promptg inTechniques

1.1 Normal Usual Prompt

Definition

A straightforward instruction or question given to the model.

Why Use It

Quick and simple.

Useful for general queries.

When to Use It

For basic definitions or explanations.

When no complex reasoning is required.

How to Use It

Ask directly: "What is X?"

Example

Normal Prompt: "What is MongoDB?"

1.2 One-Shot and Few-Shot Prompting

Definition

Providing one or a few examples in the prompt to guide the model’s output.

Why Use It

Helps the model learn the desired format or style.

Reduces errors in structured tasks.

When to Use It

For tasks requiring specific formatting.

When teaching the model a new style.

How to Use It

Include 1–3 examples before asking the model to continue.

Example

One-Shot Prompt:

Example: Input: "2+2" → Output: "4"
Now solve: "5+3"

Few-Shot Prompt:

Example: Input: "2+2" → Output: "4"
Example: Input: "10-3" → Output: "7"
Now solve: "6*2"

1.3 ReACT Prompting

Definition

ReACT (Reason + Act) prompting combines reasoning steps with actions, guiding the model to think step-by-step before answering.

Why Use It

Improves logical accuracy.

Useful for complex problem-solving.

When to Use It

For multi-step reasoning tasks.

When decisions depend on intermediate steps.

How to Use It

Instruct the model to first reason, then act.

Example

ReACT Prompt:

Question: If a train leaves at 3 PM and takes 2 hours, when will it arrive?
Reasoning: Train leaves at 3 PM. Duration is 2 hours. 3 PM + 2 hours = 5 PM.
Answer: 5 PM.
