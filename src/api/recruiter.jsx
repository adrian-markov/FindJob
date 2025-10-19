const API_URL = "http://localhost:8000";

export async function getRecruiterJobs(userId) {
  try {
    const res = await fetch(`${API_URL}/recruiter/${userId}/jobs`);
    if (!res.ok) throw new Error("Impossible de récupérer les offres");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getCompanyByRecruiter(userId) {
  try {
    const res = await fetch(`${API_URL}/recruiter/${userId}/company`);
    if (!res.ok) throw new Error("Impossible de récupérer la société");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getApplicationsByJob(jobId) {
  try {
    const res = await fetch(`${API_URL}/job/${jobId}/applications`);
    if (!res.ok) throw new Error("Impossible de récupérer les candidatures");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}