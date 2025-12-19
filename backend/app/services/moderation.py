
from transformers import BertTokenizer, BertForSequenceClassification
import torch

class ModerationResult:
    def __init__(self, is_flagged: bool, details: str = None):
        self.is_flagged = is_flagged
        self.details = details

class ModerationService:
    def __init__(self):
        self.tokenizer = BertTokenizer.from_pretrained("unitary/toxic-bert")
        self.model = BertForSequenceClassification.from_pretrained("unitary/toxic-bert")

    def moderate_text(self, text: str) -> ModerationResult:
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, padding=True)
        outputs = self.model(**inputs)
        predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
        
        # The model returns probabilities for 'toxic' and 'non-toxic'
        toxic_prob = predictions[0][1].item()
        
        if toxic_prob > 0.8: # Threshold can be adjusted
            return ModerationResult(is_flagged=True, details=f"Toxic content detected with probability: {toxic_prob:.2f}")
        
        return ModerationResult(is_flagged=False)
