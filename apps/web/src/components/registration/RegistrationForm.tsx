'use client';

import { useId, useMemo, useState } from 'react';

import { RegistrationSuccess } from '@/components/registration/RegistrationSuccess';
import { Alert } from '@/components/ui/Alert';
import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/SmartLink';
import { StatusChip } from '@/components/ui/StatusChip';
import { provinceLabel, provinces } from '@/config/provinces';
import { existingEntries, type ExistingEntry } from '@/data/tournaments';
import { formatDate, formatDateRange, formatDateTime } from '@/lib/dates';
import { isValidTckn } from '@/lib/text';
import { endDate, startDate, tournamentPath } from '@/lib/tournaments';
import type { ExtraQuestion, Tournament } from '@/types/tournament';

export interface FormValues {
  tckn: string;
  firstName: string;
  lastName: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  gender: string;
  provinceCode: string;
  phone: string;
  email: string;
  club: string;
  categoryId: string;
  answers: Record<string, string>;
  acceptRegulation: boolean;
  acceptKvkk: boolean;
}

const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const STEPS = [
  { title: 'Kimlik Bilgileri', detail: 'Sporcu kimlik bilgileri' },
  { title: 'İletişim ve Kategori', detail: 'Telefon, e-posta ve kategori' },
  { title: 'Özet ve Onay', detail: 'Kontrol ve gönderim' },
];

type Errors = Partial<Record<string, string>>;

const empty: FormValues = {
  tckn: '',
  firstName: '',
  lastName: '',
  birthDay: '',
  birthMonth: '',
  birthYear: '',
  gender: '',
  provinceCode: '',
  phone: '',
  email: '',
  club: '',
  categoryId: '',
  answers: {},
  acceptRegulation: false,
  acceptKvkk: false,
};

function validateStep1(values: FormValues): Errors {
  const errors: Errors = {};
  if (!values.tckn) errors.tckn = 'T.C. Kimlik Numarası zorunludur.';
  else if (!isValidTckn(values.tckn)) errors.tckn = 'Geçerli bir T.C. Kimlik Numarası giriniz (11 hane).';
  if (!values.firstName.trim()) errors.firstName = 'Ad zorunludur.';
  if (!values.lastName.trim()) errors.lastName = 'Soyad zorunludur.';
  if (!values.birthDay || !values.birthMonth || !values.birthYear) errors.birthDate = 'Doğum tarihini gün, ay ve yıl olarak seçiniz.';
  if (!values.gender) errors.gender = 'Cinsiyet seçiniz.';
  if (!values.provinceCode) errors.provinceCode = 'İl seçiniz.';
  return errors;
}

function validateStep2(values: FormValues, tournament: Tournament): Errors {
  const errors: Errors = {};
  if (!/^(\+90|0)?\s?5\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(values.phone.trim())) errors.phone = 'Geçerli bir cep telefonu numarası giriniz.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Geçerli bir e-posta adresi giriniz.';
  if (tournament.categories.length > 1 && !values.categoryId) errors.categoryId = 'Yarışma kategorisi seçiniz.';
  for (const question of tournament.extraQuestions) {
    if (question.required && !values.answers[question.id]?.trim()) errors[`answer-${question.id}`] = `“${question.label}” sorusu zorunludur.`;
  }
  return errors;
}

function validateStep3(values: FormValues): Errors {
  const errors: Errors = {};
  if (!values.acceptRegulation) errors.acceptRegulation = 'Turnuva yönergesini kabul etmeniz gerekir.';
  if (!values.acceptKvkk) errors.acceptKvkk = 'Başvurunun işleme alınabilmesi için KVKK aydınlatma metnini onaylamanız gerekir.';
  return errors;
}

/** Six digits from a string, stable for the same input. */
function entryNumber(input: string): string {
  let hash = 7;
  for (const char of input) hash = (hash * 31 + char.charCodeAt(0)) % 1_000_000;
  return String(hash).padStart(6, '0');
}

/** The entries on file for this identity number whose days overlap the tournament's. */
function findConflict(tckn: string, tournament: Tournament): ExistingEntry | undefined {
  return existingEntries.find(entry => entry.tckn === tckn && entry.days.some(day => tournament.days.includes(day)));
}

/** Three-step entry form: identity, contact and category, then the summary and consents. */
export function RegistrationForm({ tournament }: { tournament: Tournament }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<FormValues>(() => ({
    ...empty,
    categoryId: tournament.categories.length === 1 ? tournament.categories[0].id : '',
  }));
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState<{ code: string; at: string } | null>(null);
  const idPrefix = useId();

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues(current => ({ ...current, [key]: value }));
    setErrors(current => {
      if (!(key in current) && !(key === 'birthDay' || key === 'birthMonth' || key === 'birthYear')) return current;
      const next = { ...current };
      delete next[key];
      delete next.birthDate;
      return next;
    });
  };
  const setAnswer = (id: string, value: string) => {
    setValues(current => ({ ...current, answers: { ...current.answers, [id]: value } }));
    setErrors(current => {
      const next = { ...current };
      delete next[`answer-${id}`];
      return next;
    });
  };

  const conflict = useMemo(() => (step === 2 ? findConflict(values.tckn, tournament) : undefined), [step, values.tckn, tournament]);
  const category = tournament.categories.find(entry => entry.id === values.categoryId);
  const path = tournamentPath(tournament);

  const next = () => {
    const found = step === 0 ? validateStep1(values) : validateStep2(values, tournament);
    setErrors(found);
    if (Object.keys(found).length) {
      focusFirst(found);
      return;
    }
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    setErrors({});
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = () => {
    const found = validateStep3(values);
    if (conflict) found.conflict = `Tarih çakışması: seçilen turnuva tarihlerinde aktif bir başvurunuz bulunuyor (${conflict.tournamentTitle}).`;
    setErrors(found);
    if (Object.keys(found).length) {
      focusFirst(found);
      return;
    }
    // Demo entry number derived from the identity and the tournament; the database will assign the real one.
    const code = `TSF-${tournament.days[0].slice(0, 4)}-${entryNumber(`${values.tckn}:${tournament.slug}`)}`;
    setSubmitted({ code, at: new Date().toISOString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const focusFirst = (found: Errors) => {
    const first = Object.keys(found)[0];
    const element = document.getElementById(`${idPrefix}${first}`) ?? document.getElementById(`${idPrefix}error-summary`);
    element?.focus();
  };

  if (submitted) {
    return <RegistrationSuccess tournament={tournament} values={values} category={category} code={submitted.code} submittedAt={submitted.at} />;
  }

  const errorList = Object.entries(errors);
  const fieldId = (key: string) => `${idPrefix}${key}`;

  return (
    <div className="registration-layout">
      <ol className="steps" aria-label="Başvuru adımları">
        {STEPS.map((entry, index) => {
          const status = index < step ? 'done' : index === step ? 'current' : '';
          return (
            <li className={`step ${status}`} key={entry.title} aria-current={index === step ? 'step' : undefined}>
              <span className="step-index">{index < step ? <Icon name="check" size={14} /> : index + 1}</span>
              <span>
                <span className="label">
                  Aşama {index + 1} / {STEPS.length}
                </span>
                <b>{entry.title}</b>
              </span>
            </li>
          );
        })}
      </ol>

      {errorList.length > 0 && (
        <div id={fieldId('error-summary')} tabIndex={-1}>
          <Alert tone="error" title={`Lütfen formdaki ${errorList.length} uyarıyı düzeltiniz:`} role="alert">
            <ul>
              {errorList.map(([key, message]) => (
                <li key={key}>
                  <a href={`#${fieldId(key)}`} onClick={event => { event.preventDefault(); document.getElementById(fieldId(key))?.focus(); }}>
                    {message}
                  </a>
                </li>
              ))}
            </ul>
          </Alert>
        </div>
      )}

      {step === 2 && conflict && (
        <div id={fieldId('conflict')} tabIndex={-1}>
          <Alert tone="error" icon="x" title="Dikkat: Tarih çakışması tespit edildi" role="alert">
            <p>
              T.C. Kimlik numaranıza ait <b>{formatDateRange(conflict.days[0], conflict.days.at(-1) ?? conflict.days[0])}</b> tarihleri arasında devam eden{' '}
              <b>“{conflict.tournamentTitle}”</b> başvurunuz bulunmaktadır. Aynı tarihlerde iki farklı resmi turnuvaya eş zamanlı kayıt yapılamaz.
            </p>
            <div className="conflict-box">
              <span className="meta">
                <Icon name="calendar-blank" size={16} />
                Çakışan başvuru: <b className="mono">{conflict.code}</b>
              </span>
              <SmartLink className="text-link" href="mailto:turnuva@tsf.org.tr">
                Mevcut başvuru için iletişime geçin
              </SmartLink>
            </div>
          </Alert>
        </div>
      )}

      {step > 0 && (
        <div className="identity-banner">
          <div>
            <span className="label">Başvuran sporcu</span>
            <b>
              {values.firstName} {values.lastName}
            </b>
          </div>
          <span className="mono">
            TCKN: {values.tckn.slice(0, 3)}*****{values.tckn.slice(-3)} · Doğum: {values.birthDay}.{values.birthMonth}.{values.birthYear}
          </span>
        </div>
      )}

      <form
        className="form-card"
        noValidate
        onSubmit={event => {
          event.preventDefault();
          if (step < 2) next();
          else submit();
        }}
      >
        {step === 0 && (
          <>
            <div className="form-card-head">
              <div>
                <h2>Sporcu Kimlik Bilgileri</h2>
                <p>Lütfen nüfus cüzdanınızda yer alan bilgileri eksiksiz ve hatasız giriniz.</p>
              </div>
              <StatusChip label="* Zorunlu alanlar" tone="blue" />
            </div>
            <div className="form-section">
              <Field id={fieldId('tckn')} label="T.C. Kimlik Numarası" required error={errors.tckn} help="11 haneli kimlik numaranız. Başvuru numaranız bu kimlikle eşleştirilir.">
                <input
                  id={fieldId('tckn')}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={11}
                  value={values.tckn}
                  onChange={event => set('tckn', event.target.value.replace(/\D/g, ''))}
                  aria-invalid={Boolean(errors.tckn)}
                  aria-describedby={`${fieldId('tckn')}-help`}
                />
              </Field>
              <div className="field-row">
                <Field id={fieldId('firstName')} label="Adı" required error={errors.firstName}>
                  <input id={fieldId('firstName')} type="text" autoComplete="given-name" value={values.firstName} onChange={event => set('firstName', event.target.value)} aria-invalid={Boolean(errors.firstName)} />
                </Field>
                <Field id={fieldId('lastName')} label="Soyadı" required error={errors.lastName}>
                  <input id={fieldId('lastName')} type="text" autoComplete="family-name" value={values.lastName} onChange={event => set('lastName', event.target.value)} aria-invalid={Boolean(errors.lastName)} />
                </Field>
              </div>
              <fieldset className={`field ${errors.birthDate ? 'invalid' : ''}`} id={fieldId('birthDate')} tabIndex={-1} style={{ border: 0, padding: 0, margin: 0 }}>
                <legend className="field-label">
                  <span>
                    Doğum Tarihi<span className="required-mark">*</span>
                  </span>
                </legend>
                <div className="field-row three">
                  <select aria-label="Gün" value={values.birthDay} onChange={event => set('birthDay', event.target.value)} aria-invalid={Boolean(errors.birthDate)}>
                    <option value="">Gün</option>
                    {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map(day => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <select aria-label="Ay" value={values.birthMonth} onChange={event => set('birthMonth', event.target.value)} aria-invalid={Boolean(errors.birthDate)}>
                    <option value="">Ay</option>
                    {MONTHS.map((name, index) => (
                      <option key={name} value={String(index + 1).padStart(2, '0')}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <select aria-label="Yıl" value={values.birthYear} onChange={event => set('birthYear', event.target.value)} aria-invalid={Boolean(errors.birthDate)}>
                    <option value="">Yıl</option>
                    {Array.from({ length: 95 }, (_, i) => String(new Date().getFullYear() - 4 - i)).map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="help">Yaş kategorisi doğum yılına göre belirlenir.</span>
                {errors.birthDate && (
                  <span className="error" role="alert">
                    <Icon name="x" size={14} />
                    {errors.birthDate}
                  </span>
                )}
              </fieldset>
              <div className="field-row">
                <fieldset className={`field ${errors.gender ? 'invalid' : ''}`} id={fieldId('gender')} tabIndex={-1} style={{ border: 0, padding: 0, margin: 0 }}>
                  <legend className="field-label">
                    <span>
                      Cinsiyet<span className="required-mark">*</span>
                    </span>
                  </legend>
                  <div className="radio-group">
                    {['Erkek', 'Kadın'].map(option => (
                      <label key={option}>
                        <input type="radio" name="gender" value={option} checked={values.gender === option} onChange={() => set('gender', option)} />
                        {option}
                      </label>
                    ))}
                  </div>
                  {errors.gender && (
                    <span className="error" role="alert">
                      <Icon name="x" size={14} />
                      {errors.gender}
                    </span>
                  )}
                </fieldset>
                <Field id={fieldId('provinceCode')} label="İl" required error={errors.provinceCode}>
                  <select id={fieldId('provinceCode')} value={values.provinceCode} onChange={event => set('provinceCode', event.target.value)} aria-invalid={Boolean(errors.provinceCode)}>
                    <option value="">Seçiniz</option>
                    {provinces.map(province => (
                      <option key={province.code} value={province.code}>
                        {provinceLabel(province)}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="form-card-head">
              <div>
                <h2>İletişim ve Kategori Tercihi</h2>
                <p>Turnuva koordinatörlüğünün sizinle temas kurabilmesi için güncel bilgilerinizi giriniz.</p>
              </div>
              <StatusChip label="* Zorunlu alanlar" tone="blue" />
            </div>
            <div className="form-section">
              <h3>
                <Icon name="phone" size={18} />
                1. İletişim Bilgileri
              </h3>
              <div className="field-row">
                <Field id={fieldId('phone')} label="Cep Telefonu" required error={errors.phone} help="Masa eşlendirmeleri ve tur saatleri bu numaraya SMS olarak iletilir.">
                  <input id={fieldId('phone')} type="tel" autoComplete="tel" placeholder="+90 5xx xxx xx xx" value={values.phone} onChange={event => set('phone', event.target.value)} aria-invalid={Boolean(errors.phone)} />
                </Field>
                <Field id={fieldId('email')} label="E-posta Adresi" required error={errors.email} help="Başvuru belgesi ve turnuva bildirimleri için kullanılır.">
                  <input id={fieldId('email')} type="email" autoComplete="email" value={values.email} onChange={event => set('email', event.target.value)} aria-invalid={Boolean(errors.email)} />
                </Field>
              </div>
              <Field id={fieldId('club')} label="Kulüp veya Kurum Adı" optional help="Lig ve kulüp sıralamalarında sporcu puanı kulüp hanesine işlenir.">
                <input id={fieldId('club')} type="text" autoComplete="organization" value={values.club} onChange={event => set('club', event.target.value)} />
              </Field>
            </div>

            {tournament.categories.length > 1 && (
              <div className="form-section">
                <h3>
                  <Icon name="trophy" size={18} />
                  2. Yarışma Kategorisi Seçimi<span className="required-mark">*</span>
                </h3>
                <div className={`option-cards ${errors.categoryId ? 'invalid' : ''}`} id={fieldId('categoryId')} tabIndex={-1} role="radiogroup" aria-label="Yarışma kategorisi">
                  {tournament.categories.map(entry => (
                    <label key={entry.id} className={`option-card ${values.categoryId === entry.id ? 'selected' : ''}`}>
                      <input type="radio" name="category" value={entry.id} checked={values.categoryId === entry.id} onChange={() => set('categoryId', entry.id)} />
                      <strong>{entry.name}</strong>
                      {entry.description && <p>{entry.description}</p>}
                    </label>
                  ))}
                </div>
                {errors.categoryId && (
                  <span className="error field" role="alert">
                    <Icon name="x" size={14} />
                    {errors.categoryId}
                  </span>
                )}
              </div>
            )}

            {tournament.extraQuestions.length > 0 && (
              <div className="form-section">
                <h3>
                  <Icon name="list-checks" size={18} />
                  {tournament.categories.length > 1 ? '3.' : '2.'} Ek Bilgiler
                </h3>
                {tournament.extraQuestions.map(question => (
                  <QuestionField key={question.id} id={fieldId(`answer-${question.id}`)} question={question} value={values.answers[question.id] ?? ''} error={errors[`answer-${question.id}`]} onChange={value => setAnswer(question.id, value)} />
                ))}
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <div className="form-card-head">
              <div>
                <h2>Başvuru ve Sporcu Özet Bilgileri</h2>
                <p>Bilgilerinizi kontrol edin; düzeltmek için geri dönebilirsiniz.</p>
              </div>
              <StatusChip label="Adım 3 veri inceleme" tone="blue" />
            </div>
            <div className="summary-table">
              <SummaryRow icon="identification-card" label="Sporcu Kimliği">
                <b>
                  {values.firstName} {values.lastName}
                </b>
                <span className="mono">T.C. No: {values.tckn}</span>
                <span className="mono">Doğum: {values.birthDay}.{values.birthMonth}.{values.birthYear}</span>
              </SummaryRow>
              <SummaryRow icon="map-pin" label="İl ve Cinsiyet">
                {provinces.find(entry => entry.code === values.provinceCode)?.name} · {values.gender}
              </SummaryRow>
              {values.club && (
                <SummaryRow icon="buildings" label="Kulüp">
                  {values.club}
                </SummaryRow>
              )}
              <SummaryRow icon="phone" label="İletişim Bilgileri">
                <span className="meta">
                  <Icon name="phone" size={14} />
                  {values.phone}
                </span>
                <span className="meta">
                  <Icon name="envelope-simple" size={14} />
                  {values.email}
                </span>
              </SummaryRow>
              <SummaryRow icon="trophy" label="Tercih Edilen Kategori">
                <b>{category?.name ?? 'Genel'}</b>
                {category?.description && <StatusChip label={category.description} tone="neutral" />}
              </SummaryRow>
              {tournament.extraQuestions.map(question => (
                <SummaryRow key={question.id} icon="list-checks" label={question.label}>
                  {values.answers[question.id] || <span className="muted">Belirtilmedi</span>}
                </SummaryRow>
              ))}
              <SummaryRow icon="calendar-blank" label="Turnuva">
                <b>{tournament.title}</b>
                <span className="mono">{formatDateRange(startDate(tournament), endDate(tournament))}</span>
              </SummaryRow>
            </div>

            <div className="form-section">
              <h3>
                <Icon name="check" size={18} />
                Yasal Onaylar ve Taahhütler
              </h3>
              <label className={`checkbox-card ${values.acceptRegulation ? 'checked' : ''} ${errors.acceptRegulation ? 'invalid' : ''}`}>
                <input id={fieldId('acceptRegulation')} type="checkbox" checked={values.acceptRegulation} onChange={event => set('acceptRegulation', event.target.checked)} aria-invalid={Boolean(errors.acceptRegulation)} />
                <span>
                  <b>{tournament.title} Yarışma Yönergesi’ni</b> okudum; FIDE ve TSF kurallarına, yarışma programına ve hakem heyeti kararlarına eksiksiz uyacağımı taahhüt ederim.{' '}
                  <SmartLink href={`${path}/yonerge`}>Yönerge metnini incele</SmartLink>
                </span>
              </label>
              <label className={`checkbox-card ${values.acceptKvkk ? 'checked' : ''} ${errors.acceptKvkk ? 'invalid' : ''}`}>
                <input id={fieldId('acceptKvkk')} type="checkbox" checked={values.acceptKvkk} onChange={event => set('acceptKvkk', event.target.checked)} aria-invalid={Boolean(errors.acceptKvkk)} />
                <span>
                  <b>6698 sayılı KVKK Aydınlatma Metni’ni</b> okudum. Turnuva süresince kimlik ve sıralama verilerimin TSF resmi web portalı ve eşlendirme listelerinde yayımlanmasını onaylıyorum.<span className="required-mark">*</span>{' '}
                  <SmartLink href="https://www.tsf.org.tr/federasyon/kisisel-verilerin-korunmasi-kanunu">KVKK metnini oku</SmartLink>
                  {errors.acceptKvkk && (
                    <span className="error" role="alert" style={{ display: 'flex', marginTop: 6 }}>
                      <Icon name="x" size={14} />
                      {errors.acceptKvkk}
                    </span>
                  )}
                </span>
              </label>
            </div>
          </>
        )}

        <div className="form-actions">
          {step === 0 ? (
            <SmartLink className="button secondary" href={path}>
              <Icon name="caret-left" size={14} />
              Turnuva Detayına Dön
            </SmartLink>
          ) : (
            <button type="button" className="button secondary" onClick={back}>
              <Icon name="caret-left" size={14} />
              Geri: {STEPS[step - 1].title}
            </button>
          )}
          {step === 2 && (errorList.length > 0 || conflict) && (
            <span className="hint">
              <b>
                <Icon name="x" size={12} />
                Form kilitlendi: {errorList.length || 1} hata mevcut
              </b>
              Tüm alanlar düzeltilmeden onay verilemez
            </span>
          )}
          {step < 2 ? (
            <button type="submit" className="button primary">
              İleri: {STEPS[step + 1].title}
              <Icon name="caret-right" size={14} />
            </button>
          ) : (
            <button type="submit" className="button primary" aria-disabled={Boolean(conflict)}>
              <Icon name="check" size={16} />
              Başvuruyu Tamamla ve Onayla
            </button>
          )}
        </div>
      </form>

      <div className="next-step-tiles">
        <div className="tile">
          <Icon name="info" size={20} />
          <div>
            <h3>{step < 2 ? `Bir sonraki adım: ${STEPS[step + 1].title}` : 'Önemli hatırlatma'}</h3>
            <p>
              {step === 0 && 'Bu adımı tamamladıktan sonra iletişim bilgilerinizi, kulübünüzü ve varsa yarışma kategorinizi belirleyeceksiniz.'}
              {step === 1 && 'Bilgilerinizin son kontrolü, KVKK açık rıza ve turnuva yönergesi onayı tamamlandıktan sonra başvuru numaranız üretilecektir.'}
              {step === 2 && 'Başvuru tamamlandıktan sonra başvuru numaranız e-posta adresinize iletilecektir. Aynı tarihlerde başka bir turnuvaya başvuru yapılamaz.'}
            </p>
          </div>
        </div>
        <div className="tile pale">
          <Icon name="identification-card" size={20} />
          <div>
            <h3>KVKK ve veri güvenliği</h3>
            <p>
              Beyan edilen kimlik ve sporcu verileri yalnızca {tournament.title} eşlendirme ve kayıt işlemleri çerçevesinde işlenir. Başvuru son tarihi: {formatDateTime(tournament.registrationClosesAt)}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  required,
  optional,
  help,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  help?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`field ${error ? 'invalid' : ''}`}>
      <label htmlFor={id}>
        <span>
          {label}
          {required && <span className="required-mark">*</span>}
          {optional && <span className="optional"> (Opsiyonel)</span>}
        </span>
      </label>
      {children}
      {help && (
        <span className="help" id={`${id}-help`}>
          {help}
        </span>
      )}
      {error && (
        <span className="error" role="alert">
          <Icon name="x" size={14} />
          {error}
        </span>
      )}
    </div>
  );
}

function QuestionField({ id, question, value, error, onChange }: { id: string; question: ExtraQuestion; value: string; error?: string; onChange: (value: string) => void }) {
  if (question.type === 'boolean') {
    return (
      <fieldset className={`field ${error ? 'invalid' : ''}`} id={id} tabIndex={-1} style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="field-label">
          <span>
            {question.label}
            {question.required && <span className="required-mark">*</span>}
          </span>
        </legend>
        {question.help && <span className="help">{question.help}</span>}
        <div className="radio-group plain">
          {['Evet', 'Hayır'].map(option => (
            <label key={option}>
              <input type="radio" name={question.id} value={option} checked={value === option} onChange={() => onChange(option)} />
              {option}
            </label>
          ))}
        </div>
        {error && (
          <span className="error" role="alert">
            <Icon name="x" size={14} />
            {error}
          </span>
        )}
      </fieldset>
    );
  }
  return (
    <Field id={id} label={question.label} required={question.required} optional={!question.required} help={question.help} error={error}>
      {question.type === 'textarea' && <textarea id={id} value={value} onChange={event => onChange(event.target.value)} aria-invalid={Boolean(error)} />}
      {question.type === 'text' && <input id={id} type="text" value={value} onChange={event => onChange(event.target.value)} aria-invalid={Boolean(error)} />}
      {question.type === 'select' && (
        <select id={id} value={value} onChange={event => onChange(event.target.value)} aria-invalid={Boolean(error)}>
          <option value="">Seçiniz</option>
          {question.options?.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

function SummaryRow({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="summary-row">
      <span className="label">
        <Icon name={icon} size={16} />
        {label}
      </span>
      <span className="value">{children}</span>
    </div>
  );
}

export { formatDate };
