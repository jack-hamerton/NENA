import random
import json

# --- AI's Knowledge Base ---
# In a real application, this would be a sophisticated database or a set of learned model weights.
# Here, we simulate it with a simple dictionary to store outcomes.
knowledge_base = {
    "coding_challenges": {
        "reverse_string": {"success_rate": 1.0, "attempts": 1},
        "palindrome_check": {"success_rate": 1.0, "attempts": 1},
        "find_max": {"success_rate": 0.5, "attempts": 1},
    }
}

def self_generate_challenges(domain="coding"):
    '''
    Generates its own problems (e.g., coding challenges, math problems) to solve,
    creating a feedback loop for self-improvement.
    '''
    if domain == "coding":
        challenges = [
            {"task": "reverse_string", "description": "Generate a Python function to reverse a string."},
            {"task": "palindrome_check", "description": "Generate a Python function to check if a string is a palindrome."},
            {"task": "find_max", "description": "Generate a Python function to find the maximum number in a list."},
        ]
        challenge = random.choice(challenges)
        print(f"Generated coding challenge: {challenge['description']}")
        return challenge
    return None

def attempt_solution(challenge: dict) -> str:
    '''
    Attempts to solve a given coding challenge. This acts as the "student" agent.
    The AI's success is influenced by its historical performance (knowledge_base).
    '''
    task = challenge.get("task")
    print(f"Attempting to solve challenge: {task}")
    
    # Simulate solution generation, influenced by past performance.
    # A lower success_rate increases the chance of generating a flawed solution.
    success_rate = knowledge_base["coding_challenges"].get(task, {}).get("success_rate", 0.5)
    
    # --- Simulated Solution Library ---
    correct_solutions = {
        "reverse_string": "def reverse_string(s):\n    return s[::-1]",
        "palindrome_check": "def is_palindrome(s):\n    return s == s[::-1]",
        "find_max": "def find_max(numbers):\n    if not numbers:\n        return None\n    return max(numbers)",
    }
    
    # This version has a bug: it doesn't handle negative numbers correctly.
    buggy_find_max = "def find_max(numbers):\n    max_val = 0\n    for n in numbers:\n        if n > max_val:\n            max_val = n\n    return max_val"

    # Decide whether to produce a correct or incorrect solution based on success_rate
    if task == "find_max" and random.random() > success_rate:
        print("Injecting a known bug to simulate an imperfect AI...")
        solution = buggy_find_max
    else:
        solution = correct_solutions.get(task, "# No solution found.")
        
    print(f"Generated solution:\n{solution}")
    return solution

def evaluate_with_ai_judge(challenge: dict, generated_code: str) -> dict:
    '''
    Uses another AI model (a "judge") to evaluate the output.
    Returns a dictionary with success status and a reason.
    '''
    task = challenge.get("task")
    print(f"AI Judge is evaluating the solution for: {task}")
    try:
        local_scope = {}
        exec(generated_code, globals(), local_scope)
        func_name = next(iter(local_scope))
        func = local_scope[func_name]

        test_cases = {
            "reverse_string": [("hello", "olleh"), ("world", "dlrow")],
            "palindrome_check": [("madam", True), ("hello", False)],
            "find_max": [([1, 5, 2], 5), ([-10, 0, -1], 0), ([10, 20, -5], 20)],
        }

        for args, expected in test_cases.get(task, []):
            result = func(args)
            if result != expected:
                reason = f"Test Failed. Input: {args}, Got: {result}, Expected: {expected}"
                print(f"AI Judge: {reason}")
                return {"success": False, "reason": reason}
        
        print("AI Judge: All tests passed.")
        return {"success": True, "reason": "All tests passed."}
    except Exception as e:
        reason = f"Code execution failed. Error: {e}"
        print(f"AI Judge: {reason}")
        return {"success": False, "reason": reason}

def update_internal_parameters(feedback_data: dict):
    '''
    Adjusts internal model parameters (our simulated knowledge_base) based on feedback.
    '''
    task = feedback_data["challenge"]
    success = feedback_data["success"]
    
    # Update knowledge base
    task_stats = knowledge_base["coding_challenges"].get(task)
    if task_stats:
        old_rate = task_stats["success_rate"]
        attempts = task_stats["attempts"]
        # Update success rate using a simple moving average
        new_rate = ((old_rate * attempts) + (1 if success else 0)) / (attempts + 1)
        task_stats["success_rate"] = new_rate
        task_stats["attempts"] += 1
        
        print(f"Updating knowledge base for '{task}': Success rate changed from {old_rate:.2f} to {new_rate:.2f}")
    else:
        print("No prior knowledge for this task. Could initialize here.")

    if success:
        print("Reinforcing successful patterns.")
    else:
        print(f"Adjusting weights to correct for failure. Reason: {feedback_data.get('reason')}")
    
    print("\n--- Current AI Knowledge Base ---")
    print(json.dumps(knowledge_base, indent=2))
    print("---------------------------------")
    
    return "AI model parameters updated."

def run_self_improvement_cycle(domain="coding"):
    '''
    Orchestrates a full self-learning loop: generate, solve, evaluate, and learn.
    '''
    print("--- Starting new self-improvement cycle ---")
    challenge = self_generate_challenges(domain)
    if not challenge:
        print("Could not generate a challenge.")
        return

    solution = attempt_solution(challenge)
    evaluation = evaluate_with_ai_judge(challenge, solution)
    
    feedback = {
        "challenge": challenge["task"],
        "success": evaluation["success"],
        "reason": evaluation["reason"]
    }
    
    update_internal_parameters(feedback)
    
    print("--- Self-improvement cycle complete ---")
    return feedback

# The other learning methods remain as placeholders for now.
def supervised_learning_train(labeled_data):
    print(f"Starting supervised training on {len(labeled_data)} examples (dummy).")
    return "Supervised training complete (dummy)."

def unsupervised_learning_discover(unlabeled_data):
    print(f"Running unsupervised discovery on {len(unlabeled_data)} data points (dummy).")
    return "Unsupervised discovery complete (dummy)."

def reinforcement_learning_optimize(environment, agent):
    print(f"Starting reinforcement learning for agent '{agent}' in '{environment}' (dummy).")
    return "Reinforcement learning optimization complete (dummy)."
