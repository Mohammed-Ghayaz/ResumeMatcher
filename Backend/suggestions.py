from utils.extract_keyword import extract_keywords_from_jd


def find_missing_keywords(keywords_from_jd, resume_skills):
    resume_skills_lower = set(skill.lower() for skill in resume_skills)
    missing = [kw for kw in keywords_from_jd if kw.lower() not in resume_skills_lower]
    return missing


def suggestion(job_description, resume_skills):
    keywords_from_jd = extract_keywords_from_jd(job_description)
    missing = find_missing_keywords(keywords_from_jd, resume_skills)
    suggestion_text = "Consider adding " + (", ".join(missing))
    return suggestion_text
