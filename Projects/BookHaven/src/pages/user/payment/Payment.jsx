import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { fillFields, initiatePayment, updateProfileDetails, paymentStatusSuccess } from '../../../services/axiosconfig';

import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Card,
    InputGroup
} from 'react-bootstrap';
import Loader from './Loading';


// import Gpay from "../../../assets/googlepay240.png";
import Gpay from '../../../assets/googlepay240.png';
import PhonePe from '../../../assets/phonepe480.png';
import Paytm from '../../../assets/paytm480.png';
import AmazonPay from '../../../assets/amazonpay512.png';
import Upi from "../../../assets/bhim240.png";
import visa from "../../../assets/visa480.png";
import amex from "../../../assets/amex480.png";
import rupay from "../../../assets/rupay.png";
import Done from './Done';

// Helper to dynamically load Bootstrap CSS
const BootstrapLoader = () => {
    React.useEffect(() => {
        const linkId = 'bootstrap-css';
        if (!document.getElementById(linkId)) {
            const link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
            document.head.appendChild(link);
        }
    }, []);
    return null;
};


const customStyles = `
    body {
        background-color: #212529;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
    .payment-form-container {
        background-color: #212529;
        color: #f8f9fa;
        border-radius: 12px;
        padding: 2rem;
        max-width: 600px;
        margin: 2rem auto;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    }
    .payment-form-container .form-label {
        color: #adb5bd;
        font-size: 0.9rem;
    }
    .payment-form-container .form-control,
    .payment-form-container .form-select {
        background-color: #343a40;
        border: 1px solid #495057;
        color: #f8f9fa;
        border-radius: 8px;
        padding: 0.75rem 1rem;
    }
    .payment-form-container .form-control:focus,
    .payment-form-container .form-select:focus {
        background-color: #343a40;
        color: #f8f9fa;
        border-color: #80bdff;
        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    }
    .payment-form-container .form-control::placeholder {
        color: #6c757d;
    }
    .payment-form-container h2, .payment-form-container h3 {
        color: #ffffff;
        margin-bottom: 1.5rem;
        font-weight: 600;
    }
    .pay-button {
        background-color: #ffffff;
        color: #212529;
        font-weight: bold;
        border: none;
        border-radius: 8px;
        padding: 0.85rem;
        transition: background-color 0.2s ease-in-out, transform 0.2s ease;
    }
    .pay-button:hover {
        background-color: #e9ecef;
        transform: translateY(-2px);
    }
    .payment-method-card {
        background-color: #343a40;
        border: 1px solid #495057;
        border-radius: 8px;
    }
    .card-icons svg {
        margin: 0 0.5rem;
        width: 40px;
        height: 25px;
        fill: #adb5bd;
    }
`;
//Timing constants
const TICK_DRAW_DURATION = 1;
const TEXT_FADE_IN_DELAY = TICK_DRAW_DURATION + 0.2;
const TEXT_FADE_IN_DURATION = 0.5;
const WAIT_BEFORE_FADE_OUT = 3;
const FADE_OUT_DELAY = TEXT_FADE_IN_DELAY + TEXT_FADE_IN_DURATION + WAIT_BEFORE_FADE_OUT;
const FADE_OUT_DURATION = 0.5;

const GooglePayIcon = () => (
    <img src={Gpay} style={{ height: '48px', width: 'auto' }} alt="Google Pay" />
);

const AmazonPayIcon = () => (
    <img src={AmazonPay} style={{ height: '48px', width: 'auto' }} alt="Amazon Pay" />
);

const PaytmIcon = () => (
    <img src={Paytm} style={{ height: '75px', width: 'auto' }} alt="Paytm" />
);

const PhonePeIcon = () => (
    <img src={PhonePe} style={{ height: '48px', width: 'auto' }} alt="PhonePe" />
);

const UpiIcon = () => (
    <img src={Upi} style={{ height: '43px', width: 'auto' }} alt="BHIM UPI" />
);

const Visa = () => (
    <img src={visa} style={{ height: '55px', width: 'auto' }} alt="Visa" />
);

const Amex = () => (
    <img src={amex} style={{ height: '55px', width: 'auto' }} alt="Amex" />
);

const Rupay = () => (
    <img src={rupay} style={{ height: '55px', width: 'auto' }} alt="Rupay" />
);


function Payment() {

    //Set payment ID from external API call
    const [paymentId, setPaymentId] = useState(null);
    const navigate = useNavigate();

    //UPI details states
    const [upiId, setUpiId] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState('');

    //Debit card states
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [cvv, setCvv] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');

    //UI state management
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('UPI');
    console.log(selectedPaymentMethod);
    const [autofilling, setAutofilling] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showDoneAnimation, setShowDoneAnimation] = useState(false);

    // Generate years for the dropdown
    const currentYear = new Date().getFullYear();
    const years = Array.from({
        length: 10
    }, (_, i) => currentYear + i);

    // Generate months
    const months = Array.from({
        length: 12
    }, (_, i) => {
        const month = i + 1;
        return month < 10 ? `0${month}` : month;
    });

    useEffect(() => {
        //localStorage.setItem('user', JSON.stringify(user))
        //localStorage.setItem('jwtToken', jwttoken);
    }, []);

    useEffect(() => {
        const fetchAndFill = async () => {
            try {
                setAutofilling(true);
                const data = await fillFields();
                console.log(data);
                setAddress(data.profileDetails.address || '');
                setPhone(data.profileDetails.phoneNumber || '');
                setAmount(data.amountResponseData || '')
                setAutofilling(false)
            }
            catch (error) {
                console.log("Error encountered attempting autofilling: ", error);
                throw error;
            }
        }
        fetchAndFill();
    }, []);

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission

        let newErrors = {}; // Object to collect errors
        if (selectedPaymentMethod === 'UPI') {

            const validUpiPattern = /^[a-zA-Z0-9.-]+@(hdfc|icici|axis|sbi|ybl)$/;
            // Validate UPI ID
            if (!upiId.trim()) {
                newErrors.upiId = 'UPI ID cannot be blank.';
            }
            else if (!validUpiPattern.test(upiId)) {
                // This new error message is shown if the pattern doesn't match
                newErrors.upiId = 'Please use a valid UPI handle (e.g., @hdfc, @icici, @axis, @sbi, @ybl).';
            }
        }

        else if (selectedPaymentMethod === 'Debit Card') {
            if (!cardHolderName.trim()) {
                newErrors.cardHolderName = 'Card holder name cannot be blank.';
            }

            if (!cardNumber.trim()) {
                newErrors.cardNumber = 'Card number cannot be blank.';
            }

            if (!cvv.trim()) {
                newErrors.cvv = 'CVV cannot be blank.';
            }

            if (!expiryMonth) {
                newErrors.expiryMonth = 'Please select a month.';
            }
            if (!expiryYear) {
                newErrors.expiryYear = 'Please select a year.';
            }
        }

        // Validate Address
        if (!address.trim()) {
            newErrors.address = 'Address cannot be blank.';
        }

        // Validate Phone Number
        if (!phone) { // Check if phone is empty after filtering
            newErrors.phone = 'Phone number cannot be blank.';
        } else if (phone.length !== 10) {
            newErrors.phone = 'Phone number must be exactly 10 digits.';
        }
        setErrors(newErrors);

        // If there are no errors, proceed with payment logic
        if (Object.keys(newErrors).length === 0) {
            updateProfileDetails(address, phone);
            const intitiateDetails = await initiatePayment();
            const paymentidd = intitiateDetails.paymentId;
            setPaymentId(paymentidd);
            //console.log('Payment ID:', paymentidd);
            console.log('Form is valid. Proceeding with payment...');
            setIsLoading(true);
            setShowDoneAnimation(false); // Ensure Done is hidden when loading starts

            const randomTime = Math.floor(Math.random() * 2000) + 5000;

            setTimeout(() => {
                setIsLoading(false);
                setShowDoneAnimation(true);
                //console.log('Payment ID:', paymentId);

                console.log('Payment process completed after', randomTime / 1000, 'seconds.');

                // timeout to hide the Done component after 3 seconds
                setTimeout(async () => {
                    setShowDoneAnimation(false);
                    setUpiId('');
                    setAddress('');
                    setPhone('');
                    const successdetails = await paymentStatusSuccess(paymentidd, selectedPaymentMethod);
                    navigate("/user/orderdetails", { state: { successdetails, intitiateDetails } });
                }, 6000);
                // const successdetails = await paymentStatusSuccess(paymentidd, selectedPaymentMethod);
                // navigate("/order", { state: { successdetails, intitiateDetails} });
            }, randomTime);
        } else {
            console.log('Form has validation errors.');
        }
    };

    return (
        <>
            <BootstrapLoader />
            <style> {customStyles} </style>
            {isLoading ? (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: '#212529',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                    color: '#fff'
                }}>
                    <Loader />
                </div>
            ) : showDoneAnimation ? ( // Conditionally render Done component
                <Done />
            ) : (
                <Container className="payment-form-container py-3">
                    <div className="back-button" onClick={() => navigate(-1)}>
                        ← Back
                    </div>
                    <Form onSubmit={handleSubmit}>
                        { /* Payment Method Section */}
                        <Card className="mb-4 p-3 payment-method-card">
                            <Row className="justify-content-center" >
                                <Col md="auto">
                                    <div className="d-flex justify-content-center align-items-center flex-wrap gap-4">
                                        <GooglePayIcon />
                                        <AmazonPayIcon />
                                        <PaytmIcon />
                                        <PhonePeIcon />
                                        {/*<UpiIcon/>*/}
                                        <Visa />
                                        <Amex />

                                    </div>
                                </Col>
                            </Row>
                        </Card>

                        { /* Payment Method Selector */}
                        <Form.Group className="mb-3"> {/* Reverted to Form.Group */}
                            <Form.Label>Payment Method</Form.Label> {/* Reverted to Form.Label */}
                            <Form.Select
                                style={{ borderRadius: "18px", backgroundColor: "#343a40", color: "#f8f9fa", border: "1px solid #495057" }}
                                value={selectedPaymentMethod}
                                onChange={(e) => {
                                    setSelectedPaymentMethod(e.target.value);
                                    setErrors({}); // Clear errors when switching method
                                }}
                            >
                                <option value="UPI">UPI</option>
                                <option value="Debit Card">Debit Card</option>
                            </Form.Select>
                        </Form.Group>

                        {/*Conditional rendering based on selected payment method*/}

                        {selectedPaymentMethod === 'UPI' && (
                            <>
                                { /* UPI Details Section */}
                                <h3 > UPI Details </h3>
                                <Form.Group className="mb-3" controlId="formCardName">
                                    <Form.Label > Enter your UPI ID </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="username@bank"
                                        style={{ borderRadius: "18px" }}
                                        value={upiId} // Bind value to state
                                        onChange={(e) => setUpiId(e.target.value)} // Update state on change
                                        isInvalid={!!errors.upiId} // Mark as invalid if there's an error
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.upiId} {/* Display error message */}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </>
                        )}

                        {selectedPaymentMethod === 'Debit Card' && (
                            <>
                                <h3 > Card Information </h3>

                                <Form.Group className="mb-3" controlId="formCardName">
                                    <Form.Label>Name on card</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Name"
                                        style={{ borderRadius: "18px" }}
                                        value={cardHolderName}
                                        onChange={(e) => {
                                            const filteredName = e.target.value.replace(/\d/g, '');
                                            setCardHolderName(filteredName);
                                        }}
                                        isInvalid={!!errors.cardHolderName}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.cardHolderName}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formCardNumber">
                                    <Form.Label>Card number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        value={cardNumber}
                                        onChange={(e) => {
                                            const rawValue = e.target.value.replace(/\D/g, '');
                                            const limitedValue = rawValue.slice(0, 16);
                                            // The match() method with the regex /.{1,4}/g creates an array of 4-digit groups
                                            // e.g., "12345678" becomes ["1234", "5678"]
                                            const formattedValue = limitedValue.match(/.{1,4}/g)?.join(' ') || '';
                                            setCardNumber(formattedValue);
                                        }}
                                        maxLength="19"
                                        isInvalid={!!errors.cardNumber}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.cardNumber}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Row className="mb-3">
                                    <Col xs={6} md={6}>
                                        <Form.Group controlId="formCardExpirationMonth">
                                            <Form.Label>Card expiration</Form.Label>
                                            <Form.Select
                                                value={expiryMonth} // Bind value to state
                                                onChange={(e) => setExpiryMonth(e.target.value)} // Update state on change
                                                isInvalid={!!errors.expiryMonth} // Show red border if there's an error
                                            >
                                                <option value="" disabled>Month</option> {/* This is the placeholder */}
                                                {months.map(month => (
                                                    <option key={month} value={month}>{month}</option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.expiryMonth}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={6}>
                                        <Form.Group controlId="formCardExpirationYear">
                                            <Form.Label>Year</Form.Label>
                                            <Form.Select
                                                value={expiryYear} // Bind value to state
                                                onChange={(e) => setExpiryYear(e.target.value)} // Update state on change
                                                isInvalid={!!errors.expiryYear} // Show red border if there's an error
                                            >
                                                <option value="" disabled>Year</option> {/* This is the placeholder */}
                                                {years.map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.expiryYear}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4" controlId="formCardCVC">
                                    <Form.Label>Card Security Code</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            type="text"
                                            placeholder="CVV"
                                            value={cvv}
                                            onChange={(e) => {
                                                const numericValue = e.target.value.replace(/\D/g, '');
                                                const limitedValue = numericValue.slice(0, 3);
                                                setCvv(limitedValue);
                                            }}
                                            maxLength="4"
                                            isInvalid={!!errors.cvv}
                                        />
                                        <InputGroup.Text style={{
                                            backgroundColor: '#343a40',
                                            borderColor: '#495057',
                                            color: '#adb5bd'
                                        }}>
                                        </InputGroup.Text>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.cvv}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </>
                        )}

                        { /* Delivery Address Section */}
                        <Form.Group className="mb-3" controlId="formAddress">
                            <Form.Label > Address (click to change) </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Address"
                                style={{ borderRadius: "18px" }}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                isInvalid={!!errors.address}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.address}
                            </Form.Control.Feedback>
                        </Form.Group>

                        { /* Contact Information Section */}
                        <Form.Group className="mb-3" controlId="formPhone">
                            <Form.Label> Phone (click to change) </Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Phone"
                                style={{ borderRadius: "18px" }}
                                value={phone}
                                // onChange handler filters non-digits immediately
                                onChange={(e) => {
                                    const input = e.target.value;
                                    const numericInput = input.replace(/\D/g, ''); // Remove non-digits
                                    setPhone(numericInput); // Update state with only numeric characters
                                }}
                                isInvalid={!!errors.phone} // Mark as invalid if there's an error
                                maxLength="10" // Limit input to 10 characters directly in the field
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.phone} {/* Display error message */}
                            </Form.Control.Feedback>
                        </Form.Group>

                        { /* Amount fields */}
                        <Form.Group className="mb-3" controlId="formAmount">
                            <Form.Label> Amount </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Amount"
                                disabled={true}
                                style={{ borderRadius: "18px" }}
                                value={amount}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    setAmount(input);
                                }}
                            />
                        </Form.Group>

                        { /* Pay Button */}
                        <div className="d-grid" >
                            <Button type="submit" variant="light" size="lg" className="pay-button py-2 " style={{ borderRadius: '50px' }}>
                                Pay ₹{amount}
                            </Button>
                        </div>
                    </Form>
                </Container>
            )}
        </>
    );
}

export default Payment;
