import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { TextInput, Button, Chip, Menu, Provider, IconButton, useTheme } from 'react-native-paper';

const MultiSelectInput = ({
  options = [],
  selectedItems = [],
  setSelectedItems
}) => {
  const theme = useTheme();
  const multiSelect = React.useRef(null);
  const [visible, setVisible] = React.useState(false);

  const onSelectedItemsChange = (selectedItems) => {
    setSelectedItems(selectedItems);
  };

  return (
    <View style={{ flex: 1 }}>
      <MultiSelect
        uniqueKey="id"
        ref={multiSelect}
        hideTags
        items={options}
        onClearSelector={() => setVisible(!visible)}
        onToggleList={() => setVisible(!visible)}
        onSelectedItemsChange={onSelectedItemsChange}
        selectedItems={selectedItems}
        selectText="Seleccionar"
        searchInputPlaceholderText="Buscar elementos..."
        noItemsText="No hay elementos"
        submitButtonText="Aceptar"
        onChangeInput={(text) => console.log(text)}
        fixedHeight={true}
        displayKey="name"
        styleDropdownMenuSubsection={{ backgroundColor: theme.colors.background }}
        styleListContainer={{ height: 250, backgroundColor: theme.colors.background }}
        styleTextDropdown={{ color: theme.dark ? 'white': 'black' }}
        submitButtonColor={theme.colors.background}
        textColor={theme.dark ? 'white': 'black'}
      />
      {!visible && (
        <View style={styles.container}>
          {(multiSelect.current) && multiSelect.current.getSelectedItemsExt(selectedItems)}
        </View>
      )}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    // marginTop: 10,
    // zIndex: 0,
    // backgroundColor: 'red',
  },
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  chip: {
    marginRight: 5,
  },
});

export default MultiSelectInput;
