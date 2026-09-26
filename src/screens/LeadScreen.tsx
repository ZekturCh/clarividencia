import { useState } from 'react';

const interests = ['Team building', 'Cultura y valores', 'Integración', 'Reconocimiento', 'Convención', 'Innovación / IA'];

export interface LeadFormValues {
  fullName: string;
  company: string;
  role: string;
  email: string;
  whatsapp: string;
  interests: string[];
  accepted: boolean;
}

const initialValues: LeadFormValues = {
  fullName: '',
  company: '',
  role: '',
  email: '',
  whatsapp: '',
  interests: [],
  accepted: false,
};

export function LeadScreen({ onSubmit }: { onSubmit: (values: LeadFormValues) => void }) {
  const [values, setValues] = useState(initialValues);
  const canSubmit = values.fullName && values.company && values.email && values.accepted;

  const update = (field: keyof LeadFormValues, value: string | boolean | string[]) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const toggleInterest = (interest: string) => {
    update(
      'interests',
      values.interests.includes(interest)
        ? values.interests.filter((item) => item !== interest)
        : [...values.interests, interest],
    );
  };

  return (
    <section className="screen lead-screen">
      <p className="eyebrow">Recibe tus ideas</p>
      <h2>Déjanos tus datos para enviarte recomendaciones.</h2>
      <form
        className="lead-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (canSubmit) onSubmit(values);
        }}
      >
        <input placeholder="Nombre y apellido" value={values.fullName} onChange={(event) => update('fullName', event.target.value)} />
        <input placeholder="Empresa" value={values.company} onChange={(event) => update('company', event.target.value)} />
        <input placeholder="Cargo" value={values.role} onChange={(event) => update('role', event.target.value)} />
        <input placeholder="Correo corporativo" type="email" value={values.email} onChange={(event) => update('email', event.target.value)} />
        <input placeholder="WhatsApp" value={values.whatsapp} onChange={(event) => update('whatsapp', event.target.value)} />
        <div className="interest-grid">
          {interests.map((interest) => (
            <button type="button" className={values.interests.includes(interest) ? 'chip active' : 'chip'} key={interest} onClick={() => toggleInterest(interest)}>
              {interest}
            </button>
          ))}
        </div>
        <label className="checkbox-row">
          <input type="checkbox" checked={values.accepted} onChange={(event) => update('accepted', event.target.checked)} />
          Acepto recibir información de Clarividencia
        </label>
        <button className="primary-button" disabled={!canSubmit}>ENVIARME MI RESULTADO</button>
      </form>
    </section>
  );
}
