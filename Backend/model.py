from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-MiniLM-L6-v2')


def normalize(score, min_val=0.2, max_val=0.8):
    normalized = ((score - min_val)/(max_val - min_val))
    return round(max(0.0, min(1.0, normalized)), 4)


def compute_similarity(text1, text2, model):
    embedding1 = model.encode(text1, convert_to_tensor=True)
    embedding2 = model.encode(text2, convert_to_tensor=True)
    return normalize(util.pytorch_cos_sim(embedding1, embedding2).item())


def get_resume_score(resume_dict, job_description, model):
    # Extract resume parts
    skills_text = "Skills: " + " ".join(resume_dict.get("skills", []))
    experience_text = "Experience: " + resume_dict.get("experience", "") + "\nProjects: " + resume_dict.get("projects", "")
    education_text = "Education: " + resume_dict.get("education", "")

    # Compare each section
    skills_score = compute_similarity(skills_text, job_description, model)
    experience_score = compute_similarity(experience_text, job_description, model)
    education_score = compute_similarity(education_text, job_description, model)

    # Weighted total score
    total_score = 0.53 * skills_score + 0.42 * experience_score + 0.05 * education_score

    print(experience_text)

    return {
        "skills_score": round(skills_score, 4),
        "experience_score": round(experience_score, 4),
        "education_score": round(education_score, 4),
        "total_score": round(total_score, 4)
    }



