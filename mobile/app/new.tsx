import Icon from '@expo/vector-icons/Feather'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import {
  Switch,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import * as ImagePicker from 'expo-image-picker'
import * as SecureStore from 'expo-secure-store'
import { api } from '../src/lib/api'

export default function NewMemory() {
  const { bottom, top } = useSafeAreaInsets()
  const { push } = useRouter()

  const [preview, setPreview] = useState<string | null>(null)
  const [isPublic, setIsPublic] = useState(false)
  const [content, setContent] = useState('')

  async function openImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        selectionLimit: 1,
        quality: 1,
      })

      if (result.assets[0]) {
        setPreview(result.assets[0].uri)
      }
      console.log(result)
    } catch (error) {}
  }

  async function handleCreateMemory() {
    const token = await SecureStore.getItemAsync('token')

    let coverUrl = ''

    if (preview) {
      const uploadFormData = new FormData()

      uploadFormData.append('file', {
        name: 'image.jpg',
        type: 'image/jpeg',
        uri: preview,
      } as any)
      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      coverUrl = uploadResponse.data.fileUrl

      console.log(coverUrl)
    }

    await api.post(
      '/memories',
      {
        content,
        isPublic,
        coverUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    push('/memories')
  }

  return (
    <ScrollView
      className=" mb-4 flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className=" mt-4 flex-row items-center justify-between">
        <NLWLogo></NLWLogo>
        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon
              size={16}
              color="#FFF"
              name="arrow-left"
              className="h-10 w-10 items-center justify-center rounded-full bg-purple-500"
            ></Icon>
          </TouchableOpacity>
        </Link>
      </View>
      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            thumbColor={isPublic ? '#9b79ea' : '#9393a0'}
            trackColor={{ false: '#767577', true: '#372560' }}
          />
          <Text className="font-body text-base text-gray-200">
            Tornar memória pública
          </Text>
        </View>
        <TouchableOpacity
          onPress={openImagePicker}
          activeOpacity={0.7}
          className="h-32 items-center justify-center rounded-lg border-dashed border-gray-500 bg-black/20"
        >
          {preview ? (
            <Image
              source={{ uri: preview }}
              alt=""
              className="h-full w-full rounded-lg object-cover"
            ></Image>
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color="#FFF">
                <Text className="font-body text-sm text-gray-200">
                  {' '}
                  Adicionar foto ou vídeo de capa
                </Text>
              </Icon>
            </View>
          )}
        </TouchableOpacity>
        <TextInput
          textAlignVertical="top"
          multiline
          className="p-0 font-body text-lg text-gray-50"
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
          placeholderTextColor={'#56567a'}
          value={content}
          onChangeText={setContent}
        ></TextInput>
        <TouchableOpacity
          className="mt-6 items-center self-end rounded-full bg-green-500 px-5 py-2"
          activeOpacity={0.7}
          onPress={handleCreateMemory}
        >
          <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
