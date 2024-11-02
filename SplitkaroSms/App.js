import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import {
  Button,
  DataTable,
  Title,
  Provider as PaperProvider,
  Divider,
} from 'react-native-paper';

import useApp from './useApp';

const PermissionStatus = ({
  READ_SMS_PERMISSION_STATUS,
  RECEIVE_SMS_PERMISSION_STATUS,
  requestReadSMSPermission,
}) => {
  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>Permission Status</DataTable.Title>
      </DataTable.Header>

      <DataTable.Row>
        <DataTable.Cell>READ_SMS:</DataTable.Cell>
        <DataTable.Cell>
          {READ_SMS_PERMISSION_STATUS + '' || 'null'}
        </DataTable.Cell>
      </DataTable.Row>
      <DataTable.Row>
        <DataTable.Cell>RECEIVE_SMS:</DataTable.Cell>
        <DataTable.Cell>
          {RECEIVE_SMS_PERMISSION_STATUS + '' || 'null'}
        </DataTable.Cell>
      </DataTable.Row>

      {(!READ_SMS_PERMISSION_STATUS || !RECEIVE_SMS_PERMISSION_STATUS) && (
        <Button onPress={requestReadSMSPermission} mode="contained">
          Request Permission
        </Button>
      )}
    </DataTable>
  );
};

export default function App() {
  const {
    appState,
    buttonClickHandler,
    checkPermissions,
    hasReceiveSMSPermission,
    hasReadSMSPermission,
    requestReadSMSPermission,
    smsPermissionState,
    smsMessageBody,
    smsMessageNumber,
    smsError,
    upiTransactions, // Get the UPI transactions from the hook
  } = useApp();

  return (
    <PaperProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Title>SplitkaroSMS test application</Title>

        <DataTable>
          <DataTable.Row>
            <DataTable.Cell>App State:</DataTable.Cell>
            <DataTable.Cell>{appState}</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
        <Divider />
        <PermissionStatus
          READ_SMS_PERMISSION_STATUS={hasReadSMSPermission}
          RECEIVE_SMS_PERMISSION_STATUS={hasReceiveSMSPermission}
          requestReadSMSPermission={requestReadSMSPermission}
        />

        <Button
          style={{margin: 10}}
          onPress={checkPermissions}
          title="start"
          mode="contained">
          Recheck permission state
        </Button>
        <Button
          style={{margin: 10}}
          onPress={buttonClickHandler}
          title="start"
          mode="contained">
          Start
        </Button>

        <Divider />

        {/* New section to display UPI transactions */}
        <Title>Transactions</Title>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Amount</DataTable.Title>
            <DataTable.Title>Description</DataTable.Title>
            <DataTable.Title>Date</DataTable.Title>
          </DataTable.Header>
          {upiTransactions.length > 0 ? (
            upiTransactions.map((transaction, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>{transaction.Amount}</DataTable.Cell>
                <DataTable.Cell>{transaction.Description}</DataTable.Cell>
                <DataTable.Cell>{transaction.Date}</DataTable.Cell>
              </DataTable.Row>
            ))
          ) : (
            <DataTable.Row>
              <DataTable.Cell>No transactions found</DataTable.Cell>
              <DataTable.Cell></DataTable.Cell>
              <DataTable.Cell></DataTable.Cell>
            </DataTable.Row>
          )}
        </DataTable>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});
