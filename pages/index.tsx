/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import FormContainer from '@/containers/FormContainer'
import { useState, useRef } from 'react'

import useSWR from 'swr'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Home() {
  const popoverRef = useRef<HTMLButtonElement | null>(null)
  const [showEdit, setShowEdit] = useState<boolean>(false)
  const [valueEdit, setShowValueEdit] = useState<{
    id?: number
    title: string
    url: string
  }>({
    id: 0,
    title: '',
    url: '',
  })
  const { data: dataLinks, isLoading, mutate } = useSWR(`/api/links`, fetcher)
  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/links/delete/${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
    } finally {
      mutate()
      popoverRef.current?.click()
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Form Create Link</CardTitle>
            <CardDescription>submit your link here</CardDescription>
          </CardHeader>
          <CardContent>
            <FormContainer />
          </CardContent>
        </Card>
        {isLoading && <p>Loading...</p>}
        {dataLinks?.data?.map(
          (link: { id: number; title: string; url: string }) => (
            <Card key={link.id}>
              <CardContent className="flex justify-between">
                <a href={link.url} target="_blank">
                  {link.title}
                </a>
                <div>
                  <Button
                    size={'sm'}
                    variant={'secondary'}
                    onClick={() => {
                      setShowValueEdit({
                        id: link.id,
                        title: link.title,
                        url: link.url,
                      })
                      setShowEdit(true)
                    }}
                  >
                    Edit
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button ref={popoverRef} variant="ghost" size="sm">
                        Delete
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <p>Are you sure you want to delete this data?</p>
                      <Button size="sm" onClick={() => handleDelete(link.id)}>
                        Yes
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          ),
        )}
      </div>
      <Drawer open={showEdit} onOpenChange={setShowEdit}>
        <DrawerContent>
          <div className="container mx-auto p-4">
            <FormContainer
              id={valueEdit.id}
              values={{
                title: valueEdit.title,
                url: valueEdit.url,
              }}
              onFinished={() => {
                setShowEdit(false)
                mutate()
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
