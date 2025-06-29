import spacy
from spacy.matcher import Matcher
import string
from utils.text_extractor import extract_text_from_pdf

nlp = spacy.load("en_core_web_sm")
matcher = Matcher(nlp.vocab)

section_keywords = ["skills", "projects", "certifications", "education", "experience"]

for word in section_keywords:
    pattern = [{"LOWER": word}]
    matcher.add(word.upper(), [pattern])


def process_skills(skill_text):
    cleaned_text = ''.join(char for char in skill_text if char not in string.punctuation)
    tokens = cleaned_text.split()
    return tokens


def extract_sections(text):
    doc = nlp(text)
    matches = matcher(doc)
    results = {}

    # Collect section start indices
    section_starts = sorted([(start, nlp.vocab.strings[match_id].lower()) for match_id, start, end in matches])

    for i, (start_idx, label) in enumerate(section_starts):
        start_char = doc[start_idx].idx
        end_char = doc[section_starts[i + 1][0]].idx if i + 1 < len(section_starts) else len(doc.text)
        result = doc.text[start_char:end_char].strip()

        if label == "skills":
            result = process_skills(result)
        results[label] = result

    return results


def parse_resume(pdf_file_path):
    raw_text = extract_text_from_pdf(pdf_file_path)
    return extract_sections(raw_text)
