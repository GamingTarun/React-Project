import { useEffect, useState } from "react";
import Table from "./Table";


const emptySubject = {
  name: "",
  credits: "",
  ica: "",
  ese: ""
};

const gradeSystem = [
  { min: 90, grade: "O", point: 10 },
  { min: 80, grade: "A+", point: 9 },
  { min: 70, grade: "A", point: 8 },
  { min: 60, grade: "B+", point: 7 },
  { min: 50, grade: "B", point: 6 },
  { min: 40, grade: "C", point: 5 },
  { min: 35, grade: "D", point: 4 },
  { min: 0, grade: "F", point: 0 }
];

function getGrade(total) {
  return gradeSystem.find((item) => total >= item.min);
}

function App() {
  const [page, setPage] = useState(1);

  const [students, setStudents] = useState(() => {
    try {
      const savedStudents = localStorage.getItem("marksheetStudents");
      return savedStudents ? JSON.parse(savedStudents) : [];
    } catch {
      return [];
    }
  });

  const [profile, setProfile] = useState({
    name: "",
    studentId: "",
    rollNo: "",
    program: "",
    semester: ""
  });

  const [subject, setSubject] = useState(emptySubject);
  const [subjects, setSubjects] = useState([]);

  const [search, setSearch] = useState({
    studentId: "",
    semester: ""
  });

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "marksheetStudents",
      JSON.stringify(students)
    );
  }, [students]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubjectChange = (e) => {
    const { name, value } = e.target;

    setSubject((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const addSubject = () => {
    setMessage("");

    if (!subject.name.trim()) {
      setMessage("Please enter subject name.");
      return;
    }

    if (!subject.credits || Number(subject.credits) <= 0) {
      setMessage("Please enter valid credits.");
      return;
    }

    if (
      subject.ica === "" ||
      Number(subject.ica) < 0 ||
      Number(subject.ica) > 40
    ) {
      setMessage("ICA marks must be between 0 and 40.");
      return;
    }

    if (
      subject.ese === "" ||
      Number(subject.ese) < 0 ||
      Number(subject.ese) > 60
    ) {
      setMessage("ESE marks must be between 0 and 60.");
      return;
    }

    const subjectExists = subjects.some(
      (item) =>
        item.name.trim().toLowerCase() ===
        subject.name.trim().toLowerCase()
    );

    if (subjectExists) {
      setMessage("This subject has already been added.");
      return;
    }

    setSubjects((previous) => [
      ...previous,
      {
        name: subject.name.trim(),
        credits: subject.credits,
        ica: subject.ica,
        ese: subject.ese
      }
    ]);

    setSubject(emptySubject);
  };

  const removeSubject = (index) => {
    setSubjects((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  const submitStudent = () => {
    setMessage("");

    if (!profile.name.trim()) {
      setMessage("Please enter student name.");
      return;
    }

    if (!profile.studentId.trim()) {
      setMessage("Please enter Student ID.");
      return;
    }

    if (!profile.rollNo.trim()) {
      setMessage("Please enter Roll No.");
      return;
    }

    if (!profile.program.trim()) {
      setMessage("Please enter program.");
      return;
    }

    if (!profile.semester) {
      setMessage("Please select semester.");
      return;
    }

    if (subjects.length === 0) {
      setMessage("Please add at least one subject.");
      return;
    }

    const newStudent = {
      name: profile.name.trim(),
      studentId: profile.studentId.trim(),
      rollNo: profile.rollNo.trim(),
      program: profile.program.trim(),
      semester: profile.semester,
      subjects: [...subjects]
    };

    const existingIndex = students.findIndex(
      (student) =>
        String(student.studentId).trim() ===
          profile.studentId.trim() &&
        String(student.semester) ===
          String(profile.semester)
    );

    let updatedStudents;

    if (existingIndex !== -1) {
      updatedStudents = [...students];
      updatedStudents[existingIndex] = newStudent;
    } else {
      updatedStudents = [...students, newStudent];
    }

    setStudents(updatedStudents);
    setSelectedStudent(newStudent);

    setSearch({
      studentId: newStudent.studentId,
      semester: newStudent.semester
    });

    setMessage(
      existingIndex !== -1
        ? "Existing marksheet updated successfully."
        : "Marksheet saved successfully."
    );

    setTimeout(() => {
      setMessage("");
      setPage(2);
    }, 500);
  };

  const checkStudent = () => {
    setMessage("");
    setSelectedStudent(null);

    if (!search.studentId.trim()) {
      setMessage("Please enter Student ID.");
      return;
    }

    if (!search.semester) {
      setMessage("Please select semester.");
      return;
    }

    const foundStudent = students.find(
      (student) =>
        String(student.studentId).trim() ===
          search.studentId.trim() &&
        String(student.semester) ===
          String(search.semester)
    );

    if (!foundStudent) {
      setMessage(
        "No marksheet found for this Student ID and Semester."
      );
      return;
    }

    setSelectedStudent(foundStudent);
  };

  const viewMarksheet = () => {
    if (!selectedStudent) {
      setMessage("Please check the student first.");
      return;
    }

    setMessage("");
    setPage(3);
  };

  const goToPage1 = () => {
    setMessage("");
    setPage(1);
  };

  const goToPage2 = () => {
    setMessage("");
    setPage(2);
  };

  const updateStudent = () => {
    if (!selectedStudent) {
      setPage(1);
      return;
    }

    setProfile({
      name: selectedStudent.name,
      studentId: selectedStudent.studentId,
      rollNo: selectedStudent.rollNo,
      program: selectedStudent.program,
      semester: selectedStudent.semester
    });

    setSubjects(
      Array.isArray(selectedStudent.subjects)
        ? [...selectedStudent.subjects]
        : []
    );

    setSubject(emptySubject);
    setMessage("");
    setPage(1);
  };

  return (
    <div className="app">

      {page === 1 && (
        <div className="card">

          <h1>Enter Details</h1>

          <h3>Student Profile</h3>

          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              placeholder="Enter student name"
            />
          </div>

          <div className="form-group">
            <label>Student ID</label>

            <input
              type="text"
              name="studentId"
              value={profile.studentId}
              onChange={handleProfileChange}
              placeholder="Enter student ID"
            />
          </div>

          <div className="form-group">
            <label>Roll No.</label>

            <input
              type="text"
              name="rollNo"
              value={profile.rollNo}
              onChange={handleProfileChange}
              placeholder="Enter roll number"
            />
          </div>

          <div className="form-group">
            <label>Program</label>

            <input
              type="text"
              name="program"
              value={profile.program}
              onChange={handleProfileChange}
              placeholder="B.Sc. Computer Science"
            />
          </div>

          <div className="form-group">
            <label>Semester</label>

            <select
              name="semester"
              value={profile.semester}
              onChange={handleProfileChange}
            >
              <option value="">Select Semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
            </select>
          </div>

          <hr />

          <h3>Add Subjects</h3>

          <div className="form-group">
            <label>Subject</label>

            <input
              type="text"
              name="name"
              value={subject.name}
              onChange={handleSubjectChange}
              placeholder="Enter subject name"
            />
          </div>

          <div className="form-group">
            <label>Credits</label>

            <input
              type="number"
              name="credits"
              value={subject.credits}
              onChange={handleSubjectChange}
              min="1"
              placeholder="Enter credits"
            />
          </div>

          <div className="form-group">
            <label>ICA</label>

            <input
              type="number"
              name="ica"
              value={subject.ica}
              onChange={handleSubjectChange}
              min="0"
              max="40"
              placeholder="0 - 40"
            />
          </div>

          <div className="form-group">
            <label>ESE</label>

            <input
              type="number"
              name="ese"
              value={subject.ese}
              onChange={handleSubjectChange}
              min="0"
              max="60"
              placeholder="0 - 60"
            />
          </div>

          <button onClick={addSubject}>
            Add Subject
          </button>

          {subjects.length > 0 && (
            <div className="subject-list">

              <h4>Added Subjects</h4>

              {subjects.map((item, index) => (
                <div
                  className="subject-item"
                  key={index}
                >

                  <div className="subject-info">
                    <strong>{item.name}</strong>

                    <span>
                      {item.credits} Credits | ICA:{" "}
                      {item.ica} | ESE: {item.ese}
                    </span>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      removeSubject(index)
                    }
                  >
                    Remove
                  </button>

                </div>
              ))}

            </div>
          )}

          {message && (
            <p className="message">
              {message}
            </p>
          )}

          <button
            className="primary-btn"
            onClick={submitStudent}
          >
            Submit & View Marks
          </button>

        </div>
      )}

      {page === 2 && (
        <div className="card">

          <h1>Check Marks</h1>

          <div className="form-group">
            <label>Student ID</label>

            <input
              type="text"
              value={search.studentId}
              onChange={(e) =>
                setSearch({
                  ...search,
                  studentId: e.target.value
                })
              }
              placeholder="Enter Student ID"
            />
          </div>

          <div className="form-group">
            <label>Semester</label>

            <select
              value={search.semester}
              onChange={(e) =>
                setSearch({
                  ...search,
                  semester: e.target.value
                })
              }
            >
              <option value="">
                Select Semester
              </option>

              <option value="1">
                Semester 1
              </option>

              <option value="2">
                Semester 2
              </option>

              <option value="3">
                Semester 3
              </option>

              <option value="4">
                Semester 4
              </option>

              <option value="5">
                Semester 5
              </option>

              <option value="6">
                Semester 6
              </option>
            </select>
          </div>

          <button
            className="primary-btn"
            onClick={checkStudent}
          >
            Check
          </button>

          {message && (
            <p className="message">
              {message}
            </p>
          )}

          {selectedStudent && (
            <div className="available">

              <p>
                <strong>Student ID:</strong>{" "}
                {selectedStudent.studentId}
              </p>

              <p>
                <strong>Student Name:</strong>{" "}
                {selectedStudent.name}
              </p>

              <p>
                <strong>Semester:</strong>{" "}
                {selectedStudent.semester}
              </p>

              <p className="available-text">
                Marksheet Available
              </p>

              <button
                className="view-btn"
                onClick={viewMarksheet}
              >
                View Marksheet
              </button>

            </div>
          )}

          <button
            className="secondary-btn"
            onClick={goToPage1}
          >
            Add New Student
          </button>

        </div>
      )}

      {page === 3 && selectedStudent && (
        <div className="marksheet-page">

          <div className="marksheet-header">

            <h1>Marksheet</h1>

            <div className="student-details">

              <div>
                <p>
                  <strong>Student Name:</strong>{" "}
                  {selectedStudent.name}
                </p>

                <p>
                  <strong>Student ID:</strong>{" "}
                  {selectedStudent.studentId}
                </p>

                <p>
                  <strong>Roll No:</strong>{" "}
                  {selectedStudent.rollNo}
                </p>
              </div>

              <div>
                <p>
                  <strong>Program:</strong>{" "}
                  {selectedStudent.program}
                </p>

                <p>
                  <strong>Semester:</strong>{" "}
                  {selectedStudent.semester}
                </p>
              </div>

            </div>

          </div>

          <Table
            subjects={
              Array.isArray(selectedStudent.subjects)
                ? selectedStudent.subjects
                : []
            }
            getGrade={getGrade}
          />

          <div className="marksheet-actions">

            <button onClick={goToPage2}>
              Back
            </button>

            <button onClick={updateStudent}>
              Update Marks
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;