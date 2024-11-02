import {useEffect, useState} from 'react';
import {PermissionsAndroid} from 'react-native';
import {
  requestReadSMSPermission,
  startReadSMS,
} from '@maniac-tech/react-native-expo-read-sms';

const useApp = () => {
  const [appState, setAppState] = useState(null);
  const [hasReceiveSMSPermission, setHasReceiveSMSPermission] = useState(null);
  const [hasReadSMSPermission, setHasReadSMSPermission] = useState(null);
  const [smsPermissionState, setSmsPermissionState] = useState(null);
  const [successCallbackStatus, setSuccessCallbackStatus] = useState(null);
  const [errorCallbackStatus, setErrorCallbackStatus] = useState(null);
  const [smsMessageData, setSmsMessageData] = useState(null);
  const [smsError, setSMSError] = useState(null);
  const [upiTransactions, setUpiTransactions] = useState([]); // New state for storing UPI transactions

  const buttonClickHandler = () => {
    startReadSMS(callbackFn1, callbackFn2);
  };

  const callbackFn1 = (status, sms, error) => {
    setSmsPermissionState('Success Callback!');
    console.log(sms);

    if (status === 'Start Read SMS successfully') {
      setSuccessCallbackStatus('Start Read SMS successfully');
      setSmsMessageData(sms);
    } else if (status === 'success') {
      setSuccessCallbackStatus('just success');
      setSmsMessageData(sms);
    } else {
      setSuccessCallbackStatus('Error in success callback');
      setSMSError(error);
    }
  };

  const callbackFn2 = (status, sms, error) => {
    setSmsPermissionState('Error Callback!');
    setErrorCallbackStatus('Start Read SMS failed');
  };

  const checkPermissions = async () => {
    const customHasReceiveSMSPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
    );
    const customHasReadSMSPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
    );

    setHasReceiveSMSPermission(customHasReceiveSMSPermission);
    setHasReadSMSPermission(customHasReadSMSPermission);
    setAppState('Permission check complete');
  };

  // Function to parse SMS for UPI transaction details
  const parseUpiMessage = (message) => {
    // Regex to capture amount, description, and date
    const amountMatch = message.match(/UPI Payment of\s+(\d+)/);
    const descriptionMatch = message.match(/Note\s+(.*)\s+Date\s+(\d{8})/);
    
    if (amountMatch && descriptionMatch) {
        const amount = amountMatch[1]; // Extracting the amount
        const description = descriptionMatch[1].trim(); // Extracting the description
        const dateString = descriptionMatch[2]; // Extracting the date string

        // Formatting the date as YYYY-MM-DD
        const formattedDate = `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6)}`;

        return {
            Amount: amount,
            Description: description,
            Date: formattedDate, // Returning the formatted date
        };
    }
    return null; // Return null if the parsing fails
};

  

  useEffect(() => {
    const tempArray = smsMessageData
      ?.substring('1', smsMessageData.length - 1)
      .split(',');

    if (smsMessageData) {
      const messageBody = tempArray[1]; // Assuming body is in the second position
      const upiTransaction = parseUpiMessage(messageBody);

      if (upiTransaction) {
        setUpiTransactions(prevTransactions => [
          ...prevTransactions,
          upiTransaction,
        ]);
      }

      // Reset message data after processing
      setSmsMessageData(null);
    }
  }, [smsMessageData]);

  useEffect(() => {
    console.log('requestReadSMSPermission:', requestReadSMSPermission);
    setAppState('init');
    checkPermissions();
  }, []);

  useEffect(() => {
    if (hasReceiveSMSPermission && hasReadSMSPermission) {
      // You could initiate reading SMS here if permissions are granted
    }
  }, [hasReceiveSMSPermission, hasReadSMSPermission]);

  return {
    appState,
    buttonClickHandler,
    checkPermissions,
    errorCallbackStatus,
    hasReceiveSMSPermission,
    hasReadSMSPermission,
    requestReadSMSPermission,
    smsPermissionState,
    successCallbackStatus,
    upiTransactions, // Expose the UPI transactions
    smsError,
  };
};

export default useApp;
