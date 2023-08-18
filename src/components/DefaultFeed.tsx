import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";


const DefaultFeed = async () => {

  return (
    <Card>
    <CardHeader>
      <CardTitle> You aren&apos;t following any deliverables </CardTitle>
      <CardDescription>
        Create a deliverable or follow one to get started!
      </CardDescription>
    </CardHeader>
  </Card>
     )
}

export default DefaultFeed