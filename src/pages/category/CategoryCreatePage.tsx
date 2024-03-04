import CategoryForm from '@/components/category/CategoryForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ROUTE_CATEGORY } from '@/config/routes';
import CategoryService from '@/service/category_service';
import { parseErrorMessage } from '@/utils/api';
import useWrapInvalidToken from '@/utils/hooks/useWrapInvalidToken';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CategoryCreatePage() {
  const navigate = useNavigate();
  const wrappedCreateItem = useWrapInvalidToken((args) =>
    CategoryService.create(args),
  );
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const onSubmit = async (val: any) => {
    setLoading(true);
    try {
      const response = await wrappedCreateItem(val);
      toast({
        title: 'Success',
        description: response?.message,
      });
      setLoading(false);
      navigate(ROUTE_CATEGORY);
    } catch (error) {
      setLoading(false);

      toast({
        title: 'Error',
        description: parseErrorMessage(error),
        variant: 'destructive',
      });
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="md:w-1/2 w-full">
          <CategoryForm
            isSubmitting={loading}
            onCancel={() => navigate(ROUTE_CATEGORY)}
            onSubmit={onSubmit}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default CategoryCreatePage;
