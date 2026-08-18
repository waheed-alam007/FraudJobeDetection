import numpy as np
import pickle
import re
import os
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from nltk.corpus import stopwords
import nltk
import logging

nltk.download('stopwords')
logger = logging.getLogger(__name__)

MAX_LEN = 300

class FraudAnalyzer:
    def __init__(self):
        try:
            # Try multiple possible locations
            possible_paths = [
                '/app/bilstm_model.h5',
                'bilstm_model.h5',
                '/home/user/app/bilstm_model.h5'
            ]
            
            model_path = None
            for path in possible_paths:
                logger.info(f"Checking path: {path} -> exists: {os.path.exists(path)}")
                if os.path.exists(path):
                    model_path = path
                    break
            
            if model_path is None:
                raise FileNotFoundError("bilstm_model.h5 not found in any expected location")
            
            tokenizer_path = model_path.replace('bilstm_model.h5', 'tokenizer.pkl')
            
            logger.info(f"Loading model from: {model_path}")
            logger.info(f"Loading tokenizer from: {tokenizer_path}")
            
            self.model = load_model(model_path)
            with open(tokenizer_path, 'rb') as f:
                self.tokenizer = pickle.load(f)
            self.stop_words = set(stopwords.words('english'))
            logger.info("✅ BiLSTM model and tokenizer loaded successfully")
        except Exception as e:
            logger.error(f"❌ Failed to load model: {e}")
            self.model = None
            self.tokenizer = None

    def clean_text(self, text):
        if not text:
            return ""
        text = str(text).lower()
        text = re.sub(r'http\S+|www\S+', '', text)
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        text = ' '.join([w for w in text.split() if w not in self.stop_words])
        return text.strip()

    def analyze_posting(self, description: str, requirements: str, benefits: str, has_logo: bool, telecommuting: bool):
        if self.model is None:
            return {
                "is_fraud": False,
                "risk_score": 0.0,
                "red_flags": ["Model not loaded"],
                "feature_importance": {}
            }

        # Clean and combine text
        combined = (
            self.clean_text(description) + ' ' +
            self.clean_text(requirements) + ' ' +
            self.clean_text(benefits)
        )

        # Tokenize and pad
        sequence = self.tokenizer.texts_to_sequences([combined])
        padded = pad_sequences(sequence, maxlen=MAX_LEN, truncating='post', padding='post')

        # Predict
        score = float(self.model.predict(padded, verbose=0)[0][0])
        risk_score = round(score * 100, 2)
        is_fraud = score > 0.5

        # Generate red flags based on keywords
        red_flags = []
        text_lower = combined.lower()

        flag_keywords = {
            "wire transfer": "Requests wire transfer",
            "bitcoin": "Requests cryptocurrency payment",
            "western union": "Requests Western Union payment",
            "urgent": "Creates false urgency",
            "guaranteed": "Makes unrealistic guarantees",
            "no experience": "Suspiciously low requirements",
            "upfront": "Requests upfront payment",
            "gift card": "Requests gift card payment",
            "money order": "Requests money order",
            "work from home": "Unverified remote work claim",
        }

        for keyword, flag in flag_keywords.items():
            if keyword in text_lower:
                red_flags.append(flag)

        if not has_logo:
            red_flags.append("No company logo")

        if is_fraud and not red_flags:
            red_flags.append("Suspicious language patterns detected by BiLSTM")

        return {
            "is_fraud": bool(is_fraud),
            "risk_score": risk_score,
            "red_flags": red_flags,
            "feature_importance": {"bilstm_confidence": score, "text_weight": 0.8, "metadata_weight": 0.2}
        }

analyzer = FraudAnalyzer()
