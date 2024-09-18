import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const AppContainer = styled.div`
  background-color: #FFA500;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Container = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;
const Title = styled.h1`
  color: #FFA500;
  text-align: center;
  font-weight: bold;
`;
const Form = styled.form`
  display: grid;
  gap: 10px;
`;
const Label = styled.label`
  font-weight: bold;
`;
const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
const Textarea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
const Button = styled.button`
  background-color: #FFA500;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #FF8C00;
  }
`;
const Error = styled.div`
  color: red;
  font-weight: bold;
`;
const Reservations = styled.div`
  margin-top: 20px;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const Th = styled.th`
  background-color: #FFA500;
  color: white;
  padding: 8px;
  border: 1px solid #ddd;
`;
const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const FormularioDeReserva = () => {
    const [reservations, setReservations] = useState([]);
    const [formData, setFormData] = useState({
        lab: '',
        date: '',
        professor: '',
        discipline: '',
        qtdStudents: '',
        telephone: '',
        materials: '',
        observations: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        // Define a data mínima para 2 dias a partir de hoje
        const today = new Date();
        const minDate = new Date(today.setDate(today.getDate() + 2));
        setFormData(prev => ({ ...prev, date: minDate.toISOString().split('T')[0] }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const today = new Date();
        const reservationDate = new Date(formData.date);
        const twoDaysFromNow = new Date(today.setDate(today.getDate() + 1));

        if (reservationDate < twoDaysFromNow) {
            setError('As reservas devem ser feitas com pelo menos 2 dias de antecedência.');
            return;
        }

        if (reservations.some(r => r.lab === formData.lab && r.date === formData.date)) {
            setError('Já existe uma reserva para este laboratório nesta data.');
            return;
        }

        setReservations([...reservations, formData]);
        setError('');
        setFormData({ lab: '', date: '', professor: '', discipline: '', qtdStudents: '', telephone: '', materials: '', observations: '' });
    };

    const updateReservationsTable = (filteredReservations = reservations) => {
        return filteredReservations.map((r, index) => (
            <tr key={index}>
                <Td>{r.lab}</Td>
                <Td>{r.date}</Td>
                <Td>{r.professor}</Td>
                <Td>{r.discipline}</Td>
                <Td>{r.materials}</Td>
            </tr>
        ));
    };

    const filterReservations = (filterDate) => {
        return filterDate
            ? reservations.filter(r => r.date === filterDate)
            : reservations;
    };

    const generateReport = () => {
        let report = 'Relatório de Reservas de Laboratórios\n\n';
        reservations.forEach(r => {
            report += `Laboratório: ${r.lab}\n`;
            report += `Data: ${r.date}\n`;
            report += `Professor: ${r.professor}\n`;
            report += `Disciplina: ${r.discipline}\n`;
            report += `Materiais: ${r.materials}\n\n`;
        });

        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'relatorio_reservas.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <AppContainer>
            <Container>
                <Title>Reserva de Laboratórios</Title>
                <Form onSubmit={handleSubmit}>
                    <Label htmlFor="lab">Laboratório:</Label>
                    <Select name="lab" value={formData.lab} onChange={handleChange} required>
                        <option value="">Selecione um laboratório</option>
                        <option value="Informática 1">Informática 1</option>
                        <option value="Informática 2">Informática 2</option>
                        <option value="Informática 3">Informática 3</option>
                        <option value="Informática 4">Informática 4</option>
                        <option value="Farmácia">Farmácia</option>
                        <option value="Enfermagem">Enfermagem</option>
                        <option value="Fisioterapia">Fisioterapia</option>
                        <option value="Educação Física">Educação Física</option>
                        <option value="Multidisciplinar">Multidisciplinar</option>
                        <option value="Microscopia">Microscopia</option>
                        <option value="Anatomia">Anatomia</option>
                    </Select>

                    <Label htmlFor="date">Data:</Label>
                    <Input type="date" name="date" value={formData.date} onChange={handleChange} required />

                    <Label htmlFor="professor">Nome do Professor:</Label>
                    <Input type="text" name="professor" value={formData.professor} onChange={handleChange} required />

                    <Label htmlFor="discipline">Disciplina:</Label>
                    <Input type="text" name="discipline" value={formData.discipline} onChange={handleChange} required />

                    <Label htmlFor="qtdStudents">Quantidade de Alunos:</Label>
                    <Input type="number" name="qtdStudents" value={formData.qtdStudents} onChange={handleChange} required />

                    <Label htmlFor="telephone">Telefone: </Label>
                    <Input type="number" name="telephone" value={formData.telephone} onChange={handleChange} required />

                    <Label htmlFor="materials">Materiais Necessários:</Label>
                    <Textarea name="materials" rows="3" value={formData.materials} onChange={handleChange} />

                    <Label htmlFor="observations">Observações:</Label>
                    <Textarea name="observations" rows="3" value={formData.observations} onChange={handleChange} />

                    <Button type="submit">Reservar</Button>
                </Form>

                {error && <Error>{error}</Error>}

                <Reservations>
                    <h2>Reservas Atuais</h2>
                    <Label htmlFor="filterDate">Filtrar por data:</Label>
                    <Input type="date" id="filterDate" onChange={(e) => updateReservationsTable(filterReservations(e.target.value))} />
                    <Button type="button" onClick={generateReport}>Gerar Relatório</Button>
                    <Table id="reservationsTable">
                        <thead>
                            <tr>
                                <Th>Laboratório</Th>
                                <Th>Data</Th>
                                <Th>Professor</Th>
                                <Th>Disciplina</Th>
                                <Th>Materiais</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {updateReservationsTable()}
                        </tbody>
                    </Table>
                </Reservations>
            </Container>
        </AppContainer>
    );
};

export default FormularioDeReserva;