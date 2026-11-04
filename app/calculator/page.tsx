import Calculator from "@/components/Calculator";
import { Badge } from "@/components/tailgrids/core/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/tailgrids/core/card";

export default function CalculatorPage() {
  return (
    <div className="flex justify-center">
      <Card className="border border-base-100 shadow-md max-w-lg w-full">
        <CardHeader>
          <Badge color="blue" size="sm">
            Lab
          </Badge>
          <CardTitle className="mt-2">Calculator</CardTitle>
          <CardDescription>
            รองรับการพิมพ์จากแป้นพิมพ์ · + − × ÷
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6 flex justify-center">
          <Calculator />
        </CardContent>
      </Card>
    </div>
  );
}
