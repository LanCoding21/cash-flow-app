import CategoryForm from '@/components/category/CategoryForm';
import { Typography } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ROUTE_CATEGORY } from '@/config/routes';
import CategoryService from '@/service/category_service';
import { Category } from '@/service/types/category_type';
import { parseErrorMessage } from '@/utils/api';
import useWrapInvalidToken from '@/utils/hooks/useWrapInvalidToken';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function CategoryUpdatePage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<Category>();
  const navigate = useNavigate();

  const wrappedFetchItem = useWrapInvalidToken((args) =>
    CategoryService.getItem(args),
  );

  const wrappedUpdateItem = useWrapInvalidToken((id: number, payload: any) =>
    CategoryService.update(id, payload),
  );

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        const response = await wrappedFetchItem(id);
        if (!active || !response) return;
        setItem(response.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: parseErrorMessage(error),
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  const onSubmit = async (val: any) => {
    try {
      const response = await wrappedUpdateItem(id, val);
      toast({
        title: 'Success',
        description: response?.message,
      });
      navigate(ROUTE_CATEGORY);
    } catch (error) {
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
        <CardTitle>Update Category</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <>Loading...</> : null}
        {!loading && !item ? <Typography>Category not found</Typography> : null}
        {!loading && item ? (
          <CategoryForm
            defaultValue={item}
            onCancel={() => navigate(ROUTE_CATEGORY)}
            onSubmit={onSubmit}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}

export default CategoryUpdatePage;
