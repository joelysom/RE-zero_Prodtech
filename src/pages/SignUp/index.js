import React, { useState } from 'react';
import { User, Building2, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

function SignUp({ onNavigateToLogin }) {
  const [step, setStep] = useState(0);
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    // Client fields
    clientType: '',
    cpfOrCnpj: '',
    representativeName: '',
    companyName: '',
    
    // Common fields
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserTypeSelection = (type) => {
    setUserType(type);
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your signup logic here
    console.log('Form submitted', formData);
  };

  const renderStepZero = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Escolha seu tipo de registro</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="flex flex-col items-center h-40"
            onClick={() => handleUserTypeSelection('client')}
          >
            <User size={48} className="mb-2" />
            Registrar Cliente
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center h-40"
            onClick={() => handleUserTypeSelection('technician')}
          >
            <Wrench size={48} className="mb-2" />
            Registrar Técnico
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderClientStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Registro de Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Tipo de Cliente</Label>
            <RadioGroup 
              name="clientType" 
              value={formData.clientType}
              onValueChange={(value) => handleInputChange({ 
                target: { name: 'clientType', value } 
              })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="autonomous" id="autonomous" />
                <Label htmlFor="autonomous">Autônomo</Label>
                <RadioGroupItem value="company" id="company" />
                <Label htmlFor="company">Empresa</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.clientType === 'autonomous' && (
            <Input
              name="cpfOrCnpj"
              value={formData.cpfOrCnpj}
              onChange={handleInputChange}
              placeholder="CPF"
            />
          )}

          {formData.clientType === 'company' && (
            <>
              <Input
                name="cnpj"
                value={formData.cpfOrCnpj}
                onChange={handleInputChange}
                placeholder="CNPJ"
              />
              <Input
                name="representativeName"
                value={formData.representativeName}
                onChange={handleInputChange}
                placeholder="Nome do Representante"
              />
              <Input
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Nome da Empresa"
              />
            </>
          )}

          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nome Completo"
          />
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="E-mail"
          />
          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Senha"
          />
          <Input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirmar Senha"
          />

          <Button type="submit" className="w-full">
            Cadastrar
          </Button>
        </form>
        <div className="text-center mt-4">
          <Button 
            variant="link" 
            onClick={onNavigateToLogin}
          >
            Já possuo conta!
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderTechnicianStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Registro de Técnico</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="cpf"
            value={formData.cpfOrCnpj}
            onChange={handleInputChange}
            placeholder="CPF"
          />
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nome Completo"
          />
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="E-mail"
          />
          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Senha"
          />
          <Input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirmar Senha"
          />

          <Button type="submit" className="w-full">
            Cadastrar
          </Button>
        </form>
        <div className="text-center mt-4">
          <Button 
            variant="link" 
            onClick={onNavigateToLogin}
          >
            Já possuo conta!
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {step === 0 && renderStepZero()}
      {step === 1 && userType === 'client' && renderClientStep()}
      {step === 1 && userType === 'technician' && renderTechnicianStep()}
    </div>
  );
}

export default SignUp;