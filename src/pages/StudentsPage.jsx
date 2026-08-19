import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStudents, createStudent, deleteStudent, computeStats } from '../services/api'

function StudentsPage() {
  const [students, setStudents] = useState([])
  const [stats, setStats] = useState(() => {
    const cached = localStorage.getItem('studentStats')
    return cached ? JSON.parse(cached) : null
  })
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      const data = await getStudents()
      setStudents(data)

      const newStats = computeStats(data)
      setStats(newStats)
      localStorage.setItem('studentStats', JSON.stringify(newStats))
    } catch (err) {
      navigate('/login')
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    await createStudent({ firstName, lastName, email })
    setFirstName('')
    setLastName('')
    setEmail('')
    loadStudents()
  }

  const handleDelete = async (id) => {
    await deleteStudent(id)
    loadStudents()
  }

  return (
    <div className="students-page">
      <h1>Students</h1>

      {stats && (
        <div className="stats">
          <p>Total students: {stats.total}</p>
          <ul>
            {Object.entries(stats.domainCounts).map(([domain, count]) => (
              <li key={domain}>{domain}: {count}</li>
            ))}
          </ul>
          <small>Last updated: {new Date(stats.updatedAt).toLocaleTimeString()}</small>
        </div>
      )}

      <form onSubmit={handleAdd}>
        <input
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Add student</button>
      </form>

      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.firstName} {student.lastName} — {student.email}
            <button onClick={() => handleDelete(student.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default StudentsPage