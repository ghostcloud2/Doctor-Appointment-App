/*
  # Initial Schema Setup for DocCare

  1. New Tables
    - `profiles`
      - Stores user profile information for both patients and doctors
      - Contains basic user details and role information
    
    - `doctors`
      - Stores doctor-specific information
      - Contains specialization, experience, and availability
    
    - `symptoms`
      - Stores common symptoms for symptom checker
      - Links symptoms to possible conditions
    
    - `conditions`
      - Stores medical conditions/diseases
      - Contains description and recommended specialists
    
    - `appointments`
      - Stores appointment bookings
      - Links patients with doctors
    
    - `chats`
      - Stores chat messages between doctors and patients
      - Maintains chat history and status

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Separate access rules for doctors and patients
*/

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('patient', 'doctor');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'patient',
  full_name text,
  phone_number text,
  date_of_birth date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  specialization text NOT NULL,
  experience_years integer DEFAULT 0,
  consultation_fee decimal(10,2) NOT NULL DEFAULT 0,
  available_days text[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']::text[],
  available_hours jsonb DEFAULT '{"start": "09:00", "end": "17:00"}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create symptoms table
CREATE TABLE IF NOT EXISTS symptoms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  severity_level integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create conditions table
CREATE TABLE IF NOT EXISTS conditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  recommended_specialist text,
  symptoms uuid[] DEFAULT ARRAY[]::uuid[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status text DEFAULT 'pending',
  symptoms text[],
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  message text NOT NULL,
  sent_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Doctors policies
CREATE POLICY "Anyone can view doctors"
  ON doctors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Doctors can update own profile"
  ON doctors FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Symptoms and conditions policies
CREATE POLICY "Anyone can view symptoms"
  ON symptoms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view conditions"
  ON conditions FOR SELECT
  TO authenticated
  USING (true);

-- Appointments policies
CREATE POLICY "Patients can view own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view their appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = doctor_id);

CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

-- Chat policies
CREATE POLICY "Users can view their chat messages"
  ON chats FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

CREATE POLICY "Users can send chat messages"
  ON chats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sent_by);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON doctors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_symptoms_updated_at
  BEFORE UPDATE ON symptoms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conditions_updated_at
  BEFORE UPDATE ON conditions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();