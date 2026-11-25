document.addEventListener('DOMContentLoaded', () => {
    const subjects = subjectsData; 
    
    const subjectRows = document.querySelectorAll('.subject-row');

    subjectRows.forEach(row => {
        row.addEventListener('click', () => {
  
            subjectRows.forEach(r => r.classList.remove('active'));
            row.classList.add('active');

            const subjectId = row.getAttribute('data-subject-id');

            const selectedSubject = subjectsData.find(s => s.id == subjectId);

            if (selectedSubject) {
                document.getElementById('detail-name').textContent = selectedSubject.name;
                document.getElementById('detail-avg').textContent = selectedSubject.average || 'N/D';

                document.getElementById('btn-new-grade').style.display = 'block';

                const gradesListContainer = document.getElementById('detail-grades-list');
                gradesListContainer.innerHTML = '';

                if (selectedSubject.grades && selectedSubject.grades.length > 0) {
                    selectedSubject.grades.forEach(g => {
                        const li = document.createElement('li');
                        li.className = 'grade-history-item';

                        li.innerHTML = `
                            <span class="grade-value">${g.grade} ${g.description ? `- ${g.description}` : ''}</span>
                            <span class="grade-date">${g.grade_date}</span>
                        `;
                        gradesListContainer.appendChild(li);
                    });
                } else {
                    gradesListContainer.innerHTML = '<li class="grade-history-item"><span class="grade-value">Nessuna valutazione registrata.</span></li>';
                }
            }
        });
    });
});