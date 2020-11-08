 
import * as React from 'react';

import { StyleSheet } from 'react-native';

import { Button } from 'react-native-paper';

const ButtonPrimary = ({ children, style, onPress, loading = false }) => {
    return (
        <Button
            loading={loading}
            mode="contained"
            onPress={onPress}
            contentStyle={styles.buttonContent}
            style={[styles.button, style]}
        >
            {children}
        </Button>
    )
}

const styles = StyleSheet.create({
    buttonContent: {
        padding: 10,
    },
    button: {
        margin: 10,
    },
});
  

export default ButtonPrimary;
