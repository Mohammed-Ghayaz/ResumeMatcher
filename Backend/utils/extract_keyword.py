from keybert import KeyBERT


def extract_keywords_from_jd(jd_text, top_n=10):
    model = KeyBERT('all-MiniLM-L6-v2')  # Light, fast, and good enough
    keywords = model.extract_keywords(jd_text,
                                      keyphrase_ngram_range=(1, 2),
                                      stop_words='english',
                                      use_maxsum=True,
                                      nr_candidates=20,
                                      top_n=top_n)

    return [kw[0] for kw in keywords]
