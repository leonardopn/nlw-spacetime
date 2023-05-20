import Icon from '@expo/vector-icons/Feather'
import { Link, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import * as SecureStore from 'expo-secure-store'
import { api } from '../src/lib/api'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'

dayjs.locale(ptBr)

interface Memory {
  coverUrl: string
  id: string
  excerpt: string
  createdAt: string
}

export default function Memories() {
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()
  const [memories, setMemories] = useState<Memory[]>([])

  async function signOut() {
    await SecureStore.deleteItemAsync('token')
    router.push('/')
  }

  async function loadMemories() {
    const token = await SecureStore.getItemAsync('token')

    const response = await api.get('/memories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setMemories(response.data)
  }

  useEffect(() => {
    loadMemories()
  }, [])

  return (
    <ScrollView
      className="flex-1 "
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className=" mt-4 flex-row items-center justify-between px-8">
        <NLWLogo></NLWLogo>
        <View className="flex-row gap-2">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
            onPress={signOut}
          >
            <Icon size={16} color="#000" name="log-out"></Icon>
          </TouchableOpacity>
          <Link href="new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon size={16} color="#000" name="plus"></Icon>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      <View className="mt-6 space-y-10">
        {memories.map((memory) => (
          <View className="space-y-4" key={memory.id}>
            <View className="flex-row items-center gap-2">
              <View className="h-px w-5 bg-gray-50"></View>
              <Text className="font-body text-sm text-gray-100">
                {dayjs(memory.createdAt).format(`DD [de] MMMM, YYYY`)}
              </Text>
            </View>
            <View className="space-y-4 px-8">
              <Image
                alt=""
                source={{
                  uri: memory.coverUrl,
                }}
                className="aspect-video w-full rounded-lg"
              ></Image>
              <Text className="font-body text-base leading-relaxed text-gray-100">
                {memory.excerpt}
              </Text>
              <Link href={`/memories/${memory.id}`} asChild>
                <TouchableOpacity className="flex-row items-center gap-2">
                  <Text className="font-body text-sm text-gray-200">
                    Ler mais
                  </Text>
                  <Icon name="arrow-right" size={16} color="#9e9ea0"></Icon>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
