import { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { FamilyHeader } from '../components/FamilyHeader';
import { MemberList } from '../components/MemberList';
import { InvitationSection } from '../components/InvitationSection';
import { MemberActionsModal } from '../components/MemberActionsModal';
import { MOCK_MEMBERS, FamilyMember } from '../components/managment/mock-data';
import { Button } from '@/core/ui/button';

export default function FamilyManagementScreen() {
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleShowActions = (member: FamilyMember) => {
    setSelectedMember(member);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedMember(null);
  };

  const handleSetRole = (role: 'ADMINISTRATOR' | 'MEMBER' | 'CAREGIVER') => {
    if (selectedMember) {
      const updatedMembers = members.map((m) =>
        m.id === selectedMember.id ? { ...m, role } : m
      );
      setMembers(updatedMembers);
    }
    handleCloseModal();
  };

  const handleRemoveMember = () => {
    if (selectedMember) {
      Alert.alert(
        'Eliminar Miembro',
        `¿Estás seguro de que quieres eliminar a ${selectedMember.name}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => {
              const updatedMembers = members.filter((m) => m.id !== selectedMember.id);
              setMembers(updatedMembers);
              handleCloseModal();
            },
          },
        ]
      );
    }
  };

  const handleDeleteFamily = () => {
    Alert.alert(
      'Eliminar Familia',
      '¿Estás seguro de que quieres eliminar la familia? Esta acción es irreversible.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            // Here you would typically make an API call to delete the family
            // and then navigate the user away or update the UI accordingly.
            console.log('Familia eliminada');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <FamilyHeader />
      <MemberList onShowActions={handleShowActions} />
      <View style={styles.separator} />
      <InvitationSection />
      <View style={styles.separator} />
      <View style={styles.footer}>
        <Button label="Eliminar Familia" onPress={handleDeleteFamily} variant="danger" />
      </View>
      <MemberActionsModal
        member={selectedMember}
        visible={isModalVisible}
        onClose={handleCloseModal}
        onSetRole={handleSetRole}
        onRemove={handleRemoveMember}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFDF6',
  },
  separator: {
    height: 48,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
});
