import {
  FlatList,
  ScrollView,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import {Searchbar} from 'react-native-paper';
import {Button} from 'react-native-paper';
import {DataTable} from 'react-native-paper';
import {Modal, Portal, Text} from 'react-native-paper';
import {TextInput} from 'react-native-paper';
import {useState} from 'react';

import {ActivityIndicator, Dialog, Paragraph} from 'react-native-paper';

const numberOfItemsPerPageList = [2, 3, 4];

const items = [
  {
    key: 1,
    name: 'Name',
  },
  {
    key: 2,
    name: 'Number',
  },
  {
    key: 3,
    name: 'PanId',
  },
];
export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [userdata, setUserdata] = React.useState([
    {
      name: '',
      panid: '',
      number: '',
    },
  ]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = (query: any) => {
    setSearchQuery(query);

    // Filter the data based on the search query
    const filtered = userdata.filter(item => {
      const itemName = item?.name.toLowerCase();
      const itemPanId = item?.panid.toLowerCase();
      const itemNumber = item?.number.toString().toLowerCase();
      const lowerCaseQuery = query.toLowerCase();

      return (
        itemName.includes(lowerCaseQuery) ||
        itemPanId.includes(lowerCaseQuery) ||
        itemNumber.includes(lowerCaseQuery)
      );
    });
    setFilteredData(filtered);
  };

  function getdatawithapi() {
    setLoading(true);
    fetch('https://contact-apt.vercel.app/getdata').then(res =>
      res
        .json()
        .then(data => {
          console.log(data);
          setUserdata(data.Users);
          setFilteredData(data.Users);
          setLoading(false);
        })
        .catch(error => console.log(error)),
    );
  }

  React.useEffect(() => {
    getdatawithapi();
  }, []);

  const [deleteId,SetdeleleID] = useState('')

  const renderItem = ({item}: any) => (
    <DataTable.Row key={item._id} onPress={()=>{
        SetdeleleID(item._id)
        showDialog()
    }}>
      <DataTable.Cell>{item.name}</DataTable.Cell>
      <DataTable.Cell>{item.number}</DataTable.Cell>
      <DataTable.Cell>{item.panid}</DataTable.Cell>
    </DataTable.Row>
  );

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};

  const [name, setName] = useState('');
  const [panId, setPanId] = useState('');
  const [number, setNumber] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://contact-apt.vercel.app/adddata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          number: number,
          panid: panId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Post created:', data);
        // Reset input fields
        hideModal();
        setTimeout(() => {
          getdatawithapi();
        }, 1000);
        setName('');
        setPanId('');
        setNumber('');
      } else {
        console.log('Error:', response.status);
      }
    } catch (error) {
      console.error(error);
    }

    console.log(name, panId, number);
    // Clear the input fields
  };

  const [visibleDialog, setVisibleDialog] = useState(false);

  const showDialog = () => setVisibleDialog(true);
  const hideDialog = () => setVisibleDialog(false);

  const handleDelete = async () => {
    try {
        const response = await fetch('https://contact-apt.vercel.app/deletdata', {
          method: 'Delete',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
          _id:deleteId
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Delete created:', data);
          // Reset input fields
          hideDialog();
          setTimeout(() => {
            getdatawithapi();
          }, 1000);
          SetdeleleID('');
        } else {
          console.log('Error:', response.status);
        }
      } catch (error) {
        console.error(error);
      }
  
  
  };

  return (
    <View style={styles.container}>
      <Searchbar
        style={styles.search}
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <Button style={styles.button} mode="outlined" onPress={showModal}>
        Add{' '}
      </Button>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}>
          <Text>Add User</Text>
          <TextInput
            mode="outlined"
            label="Name"
            placeholder="Enter Name"
            value={name}
            onChangeText={text => setName(text)}
          />
          <TextInput
            mode="outlined"
            label="Number"
            placeholder="Enter Number"
            value={number}
            onChangeText={text => setNumber(text)}
            keyboardType="numeric"
          />
          <TextInput
            mode="outlined"
            label="PanID"
            placeholder="Enter PanID"
            value={panId}
            onChangeText={text => setPanId(text)}
          />
          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Submit
          </Button>
        </Modal>
      </Portal>
      <Portal>
        <Dialog visible={visibleDialog} onDismiss={hideDialog}>
          <Dialog.Title>Confirm Delete</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to delete?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={handleDelete}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <View>
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator animating={true} color={'blue'} size="large" />
          </View>
        )}
        <DataTable>
          <DataTable.Header>
            <DataTable.Title sortDirection="descending">Name</DataTable.Title>
            <DataTable.Title>Numner</DataTable.Title>
            <DataTable.Title>PanID</DataTable.Title>
          </DataTable.Header>

          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={item => item._id}
          />
        </DataTable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  button: {
    margin: 20,
  },
  search: {},
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
