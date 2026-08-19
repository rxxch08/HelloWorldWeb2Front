const API_URL = 'http://localhost:3000'

function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  if (!res.ok) {
    throw new Error('Invalid credentials')
  }

  return res.json()
}

export async function getStudents() {
  const res = await fetch(`${API_URL}/students`, {
    headers: getAuthHeaders()
  })

  if (!res.ok) {
    throw new Error('Failed to fetch students')
  }

  return res.json()
}

export async function createStudent(student) {
  const res = await fetch(`${API_URL}/students`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(student)
  })

  if (!res.ok) {
    throw new Error('Failed to create student')
  }

  return res.json()
}

export async function deleteStudent(id) {
  const res = await fetch(`${API_URL}/students/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  })

  if (!res.ok) {
    throw new Error('Failed to delete student')
  }
}

export function computeStats(students) {
  const total = students.length

  const domainCounts = {}
  students.forEach((s) => {
    const domain = s.email.split('@')[1] || 'unknown'
    domainCounts[domain] = (domainCounts[domain] || 0) + 1
  })

  return { total, domainCounts, updatedAt: new Date().toISOString() }
}