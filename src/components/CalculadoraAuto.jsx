import React, { useState } from 'react';
import { Car, Calculator, Calendar } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker.css";

// Register Spanish locale
registerLocale('es', es);

const InputField = ({ label, name, value, onChange, required = false, type = "number", showDollarSign = false, showPercentSign = false, suffix, className = "", labelContent = null }) => (
  <div className={`mb-6 ${className}`}>
    <div className="flex justify-between items-center mb-2">
      <label htmlFor={name} className="block text-gray-300 text-base">
        {label}
      </label>
      {labelContent}
    </div>
    <div className="relative">
      {showDollarSign && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
          $
        </span>
      )}
      <input
        type={type}
        name={name}
        id={name}
        required={required}
        className={`w-full rounded-xl border border-gray-700 bg-[#1a1a1a] p-4 text-lg ${showDollarSign ? 'pl-8' : ''} focus:outline-none focus:ring-2 focus:ring-blue-500 text-white`}
        value={value}
        onChange={onChange}
      />
      {showPercentSign && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          %
        </span>
      )}
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

const ToggleButton = ({ options, value, onChange }) => (
  <div className="flex rounded-lg border border-gray-700 p-0.5 bg-[#1a1a1a]">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          value === option.value
            ? 'bg-blue-600 text-white'
            : 'text-gray-400 hover:text-white'
        }`}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);

const DatePickerField = ({ label, selected, onChange, required = false }) => (
  <div className="mb-6">
    <label className="block text-gray-300 text-base mb-2">
      {label}
    </label>
    <div className="relative">
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        locale="es"
        required={required}
        className="w-full rounded-xl border border-gray-700 bg-[#1a1a1a] p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        calendarClassName="dark-theme"
        showPopperArrow={false}
      />
      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
    </div>
  </div>
);

const CalculadoraAuto = () => {
  const [formData, setFormData] = useState({
    precioAuto: '',
    enganche: '',
    plazo: '48',
    tasaInteres: '5.6',
    gasolinaMensual: '225',
    seguroMensual: '50',
    mantenimientoAnual: '400',
    otros: '10',
  });

  const [engancheType, setEngancheType] = useState('percentage'); // 'percentage' or 'amount'
  const [startDate, setStartDate] = useState(new Date());
  const [resultado, setResultado] = useState(null);
  const [tablaAmortizacion, setTablaAmortizacion] = useState(null);

  const calcularPago = (e) => {
    e.preventDefault();
    
    const precio = parseFloat(formData.precioAuto);
    const engancheValue = parseFloat(formData.enganche);
    const enganche = engancheType === 'percentage' ? (precio * engancheValue / 100) : engancheValue;
    const plazo = parseInt(formData.plazo);
    const tasaAnual = parseFloat(formData.tasaInteres);
    const seguroMensual = parseFloat(formData.seguroMensual);
    const gasolinaMensual = parseFloat(formData.gasolinaMensual);
    const mantenimientoMensual = parseFloat(formData.mantenimientoAnual) / 12;
    const otros = parseFloat(formData.otros);
    
    const montoFinanciar = precio - enganche;
    const tasaMensual = tasaAnual / 12 / 100;
    
    const pagoBase = montoFinanciar * (tasaMensual * Math.pow(1 + tasaMensual, plazo)) / 
                    (Math.pow(1 + tasaMensual, plazo) - 1);

    // Calculate additional expenses
    const gastosAdicionales = gasolinaMensual + seguroMensual + mantenimientoMensual + otros;
    const pagoMensualTotal = pagoBase + gastosAdicionales;
    
    // Generate amortization table
    const tabla = [];
    let saldoPendiente = montoFinanciar;
    let fecha = new Date(startDate);
    
    for (let i = 0; i < plazo; i++) {
      const interesMensual = saldoPendiente * tasaMensual;
      const capitalMensual = pagoBase - interesMensual;
      saldoPendiente -= capitalMensual;
      
      tabla.push({
        fecha: new Date(fecha).toLocaleDateString('es-MX', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        cuota: pagoBase.toFixed(2),
        capital: capitalMensual.toFixed(2),
        interes: interesMensual.toFixed(2),
        saldo: Math.max(0, saldoPendiente).toFixed(2)
      });
      
      fecha.setMonth(fecha.getMonth() + 1);
    }
    
    setTablaAmortizacion(tabla);
    setResultado({
      pagoBase: pagoBase.toFixed(2),
      gastosAdicionales: gastosAdicionales.toFixed(2),
      pagoMensualTotal: pagoMensualTotal.toFixed(2),
      montoFinanciar: montoFinanciar.toFixed(2),
      totalPagar: (pagoMensualTotal * plazo).toFixed(2),
      engancheFinal: enganche.toFixed(2)
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate and display the actual down payment amount when using percentage
  const getEngancheHelperText = () => {
    if (!formData.precioAuto || !formData.enganche) return null;
    
    if (engancheType === 'percentage') {
      const montoEnganche = (parseFloat(formData.precioAuto) * parseFloat(formData.enganche)) / 100;
      return `Monto del enganche: $${montoEnganche.toFixed(2)}`;
    } else {
      const porcentajeEnganche = (parseFloat(formData.enganche) / parseFloat(formData.precioAuto)) * 100;
      return `Porcentaje del enganche: ${porcentajeEnganche.toFixed(1)}%`;
    }
  };

  return (
    <div className="w-full bg-[#242424] text-white">
      <div className="w-full">
        <div className="bg-[#242424]">
          {/* Header */}
          <div className="flex items-center gap-2 p-4 border-b border-gray-700">
            <Car className="h-6 w-6" />
            <h2 className="text-xl">Calculadora de Pagos de Auto</h2>
          </div>
          
          {/* Form */}
          <div className="p-4">
            <form onSubmit={calcularPago}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-300">Datos Básicos</h3>
                  <InputField
                    label="Precio del Auto"
                    name="precioAuto"
                    value={formData.precioAuto}
                    onChange={handleInputChange}
                    required
                    showDollarSign
                  />

                  <div className="relative mb-6">
                    <InputField
                      label="Enganche"
                      name="enganche"
                      value={formData.enganche}
                      onChange={handleInputChange}
                      required
                      showDollarSign={engancheType === 'amount'}
                      showPercentSign={engancheType === 'percentage'}
                      className="mb-0"
                      labelContent={
                        <ToggleButton
                          options={[
                            { label: 'Porcentaje', value: 'percentage' },
                            { label: 'Monto', value: 'amount' }
                          ]}
                          value={engancheType}
                          onChange={setEngancheType}
                        />
                      }
                    />
                    {getEngancheHelperText() && (
                      <div className="text-sm text-gray-400 mt-1">
                        {getEngancheHelperText()}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <InputField
                      label="Plazo (meses)"
                      name="plazo"
                      value={formData.plazo}
                      onChange={handleInputChange}
                      required
                    />

                    <InputField
                      label="Tasa de Interés Anual"
                      name="tasaInteres"
                      value={formData.tasaInteres}
                      onChange={handleInputChange}
                      required
                      showPercentSign
                    />
                  </div>

                  <DatePickerField
                    label="Fecha de Inicio"
                    selected={startDate}
                    onChange={date => setStartDate(date)}
                    required
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-300">Gastos Adicionales</h3>
                  <InputField
                    label="Gasolina Mensual"
                    name="gasolinaMensual"
                    value={formData.gasolinaMensual}
                    onChange={handleInputChange}
                    showDollarSign
                  />

                  <InputField
                    label="Seguro Mensual"
                    name="seguroMensual"
                    value={formData.seguroMensual}
                    onChange={handleInputChange}
                    showDollarSign
                  />

                  <InputField
                    label="Mantenimiento Anual"
                    name="mantenimientoAnual"
                    value={formData.mantenimientoAnual}
                    onChange={handleInputChange}
                    showDollarSign
                  />

                  <InputField
                    label="Otros Gastos Mensuales"
                    name="otros"
                    value={formData.otros}
                    onChange={handleInputChange}
                    showDollarSign
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 text-white p-4 rounded-xl font-medium flex items-center justify-center gap-2 mt-6"
              >
                <Calculator className="h-5 w-5" />
                Calcular Pago Mensual
              </button>
            </form>

            {resultado && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Resultados:</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Pago Base del Auto:</span>
                    <span className="text-xl font-semibold">${resultado.pagoBase}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Gastos Adicionales:</span>
                    <span className="text-xl font-semibold">${resultado.gastosAdicionales}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Pago Mensual Total:</span>
                    <span className="text-xl font-semibold text-green-500">${resultado.pagoMensualTotal}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Enganche:</span>
                    <span className="text-xl font-semibold">${resultado.engancheFinal}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Monto a Financiar:</span>
                    <span className="text-xl font-semibold">${resultado.montoFinanciar}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Total a Pagar:</span>
                    <span className="text-xl font-semibold">${resultado.totalPagar}</span>
                  </div>
                </div>

                {tablaAmortizacion && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Tabla de Amortización:</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-300 border-b border-gray-700">
                            <th className="text-left p-2">Fecha</th>
                            <th className="text-right p-2">Cuota</th>
                            <th className="text-right p-2">Capital</th>
                            <th className="text-right p-2">Interés</th>
                            <th className="text-right p-2">Saldo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tablaAmortizacion.map((row, index) => (
                            <tr key={index} className="border-b border-gray-800 hover:bg-gray-800">
                              <td className="p-2">{row.fecha}</td>
                              <td className="text-right p-2">${row.cuota}</td>
                              <td className="text-right p-2">${row.capital}</td>
                              <td className="text-right p-2">${row.interes}</td>
                              <td className="text-right p-2">${row.saldo}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculadoraAuto;
