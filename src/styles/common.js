import { StyleSheet } from 'react-native';
import Theme from '../theme/Theme';

const commonStyles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        padding: Theme.SIZES.padding,
        backgroundColor: '#fff',
    },
    listSeparator: {
        height: 1,
        backgroundColor: Theme.COLORS.border,
        marginLeft: 72, // align separator after thumbnail
    },
});

export default commonStyles;
