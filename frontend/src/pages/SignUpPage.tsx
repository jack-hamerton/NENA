
import React, { useState } from 'react';
import PhoneNumberForm from '../components/PhoneNumberForm';
import VerificationCodeForm from '../components/VerificationCodeForm';
import CreateProfileForm from '../components/CreateProfileForm';

const SignUpPage = () => {
  const [step, setStep] = useState('phoneNumber'); // phoneNumber, verificationCode, createProfile
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePhoneNumberSubmit = (submittedPhoneNumber: string) => {
    // Here you would call the service to send the verification code
    console.log(`Sending verification code to ${submittedPhoneNumber}`);
    setPhoneNumber(submittedPhoneNumber);
    setStep('verificationCode');
  };

  const handleVerificationCodeSubmit = (code: string) => {
    // Here you would call the service to verify the code
    console.log(`Verifying code ${code} for ${phoneNumber}`);
    setStep('createProfile');
  };

  const handleProfileCreate = (profileData: { name: string; email: string }) => {
    // Here you would call the service to create the user profile
    console.log('Creating profile:', profileData);
    // Redirect to the profile page or another appropriate page
  };

  return (
    <div className="sign-up-page">
      {step === 'phoneNumber' && (
        <PhoneNumberForm onSubmit={handlePhoneNumberSubmit} />
      )}
      {step === 'verificationCode' && (
        <VerificationCodeForm onSubmit={handleVerificationCodeSubmit} />
      )}
      {step === 'createProfile' && (
        <CreateProfileForm onSubmit={handleProfileCreate} />
      )}
    </div>
  );
};

export default SignUpPage;
