import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import MainNavbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import { validatePassword } from '../utils/passwordPolicy';
import { auth } from '../firebase/config';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const ManagePasswords = () => {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    setLoading(true);
    try {
      if (!auth.currentUser || !auth.currentUser.email) {
        throw new Error('No logged in user');
      }
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await changePassword(newPassword);
      setSuccess('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MainNavbar />
      <Container className="pos-content">
        <PageHeader title="Manage Passwords" icon="lock_reset" subtitle="Change your account password." />
        <Card>
          <Card.Body>
            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <InputGroup>
                  <Form.Control type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                  <Button variant="outline-secondary" onClick={() => setShowCurrent(!showCurrent)} aria-label="Toggle current password visibility">
                    <i className={`bi ${showCurrent ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </Button>
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <InputGroup>
                  <Form.Control type={showNew ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                  <Button variant="outline-secondary" onClick={() => setShowNew(!showNew)} aria-label="Toggle new password visibility">
                    <i className={`bi ${showNew ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </Button>
                </InputGroup>
                <Form.Text className="text-muted">At least 8 characters, include uppercase, lowercase, number, and special character.</Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup>
                  <Form.Control type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                  <Button variant="outline-secondary" onClick={() => setShowConfirm(!showConfirm)} aria-label="Toggle confirm password visibility">
                    <i className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </Button>
                </InputGroup>
              </Form.Group>
              <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default ManagePasswords;