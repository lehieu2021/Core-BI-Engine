import { Dataset, Field } from '../types';

/**
 * Service xử lý dataset
 */
export class DatasetService {
  /**
   * Tạo dataset mới
   * @param name Tên dataset
   * @param fields Danh sách fields
   * @param data Dữ liệu
   * @returns Dataset
   */
  public static createDataset(name: string, fields: Field[], data: Record<string, any>[] = []): Dataset {
    const id = `dataset-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    return {
      id,
      name,
      fields,
      data
    };
  }
  
  /**
   * Thêm field vào dataset
   * @param dataset Dataset
   * @param field Field mới
   * @returns Dataset đã cập nhật
   */
  public static addField(dataset: Dataset, field: Field): Dataset {
    // Kiểm tra field đã tồn tại chưa
    const existingField = dataset.fields.find(f => f.id === field.id);
    
    if (existingField) {
      return dataset;
    }
    
    return {
      ...dataset,
      fields: [...dataset.fields, field]
    };
  }
  
  /**
   * Xóa field khỏi dataset
   * @param dataset Dataset
   * @param fieldId ID của field
   * @returns Dataset đã cập nhật
   */
  public static removeField(dataset: Dataset, fieldId: string): Dataset {
    return {
      ...dataset,
      fields: dataset.fields.filter(field => field.id !== fieldId)
    };
  }
  
  /**
   * Thêm dữ liệu vào dataset
   * @param dataset Dataset
   * @param data Dữ liệu mới
   * @returns Dataset đã cập nhật
   */
  public static addData(dataset: Dataset, data: Record<string, any>[]): Dataset {
    return {
      ...dataset,
      data: [...dataset.data, ...data]
    };
  }
  
  /**
   * Cập nhật dữ liệu của dataset
   * @param dataset Dataset
   * @param data Dữ liệu mới
   * @returns Dataset đã cập nhật
   */
  public static updateData(dataset: Dataset, data: Record<string, any>[]): Dataset {
    return {
      ...dataset,
      data
    };
  }
  
  /**
   * Lọc dữ liệu của dataset
   * @param dataset Dataset
   * @param filters Điều kiện lọc
   * @returns Dữ liệu đã lọc
   */
  public static filterData(dataset: Dataset, filters: Record<string, any>): Record<string, any>[] {
    return dataset.data.filter(item => {
      // Kiểm tra từng điều kiện lọc
      return Object.entries(filters).every(([key, value]) => {
        // Nếu giá trị là mảng, kiểm tra item[key] có trong mảng không
        if (Array.isArray(value)) {
          return value.includes(item[key]);
        }
        
        // Nếu giá trị là hàm, gọi hàm với item[key]
        if (typeof value === 'function') {
          return value(item[key]);
        }
        
        // Mặc định so sánh bằng
        return item[key] === value;
      });
    });
  }
  
  /**
   * Sắp xếp dữ liệu của dataset
   * @param dataset Dataset
   * @param sortBy Field cần sắp xếp
   * @param sortOrder Thứ tự sắp xếp
   * @returns Dữ liệu đã sắp xếp
   */
  public static sortData(
    dataset: Dataset,
    sortBy: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Record<string, any>[] {
    return [...dataset.data].sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      
      // Xử lý giá trị null/undefined
      if (valueA === undefined || valueA === null) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      
      if (valueB === undefined || valueB === null) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      
      // So sánh theo kiểu dữ liệu
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOrder === 'asc' ? 
          valueA.localeCompare(valueB) : 
          valueB.localeCompare(valueA);
      }
      
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      }
      
      if (valueA instanceof Date && valueB instanceof Date) {
        return sortOrder === 'asc' ? 
          valueA.getTime() - valueB.getTime() : 
          valueB.getTime() - valueA.getTime();
      }
      
      // Mặc định chuyển đổi sang string để so sánh
      const strA = String(valueA);
      const strB = String(valueB);
      
      return sortOrder === 'asc' ? 
        strA.localeCompare(strB) : 
        strB.localeCompare(strA);
    });
  }
  
  /**
   * Phân tích kiểu dữ liệu của các fields từ dữ liệu
   * @param data Dữ liệu
   * @returns Danh sách fields
   */
  public static inferFields(data: Record<string, any>[]): Field[] {
    if (!data.length) return [];
    
    // Lấy tất cả các keys từ dữ liệu
    const keys = Object.keys(data[0]);
    
    return keys.map(key => {
      // Lấy tất cả các giá trị không null/undefined của field
      const values = data
        .map(item => item[key])
        .filter(value => value !== null && value !== undefined);
      
      // Xác định kiểu dữ liệu
      let dataType: Field['dataType'] = 'string';
      
      if (values.length > 0) {
        const firstValue = values[0];
        
        if (typeof firstValue === 'number') {
          dataType = 'number';
        } else if (firstValue instanceof Date) {
          dataType = 'date';
        } else if (typeof firstValue === 'boolean') {
          dataType = 'boolean';
        }
      }
      
      return {
        id: key,
        name: key,
        dataType,
        displayName: key
      };
    });
  }
  
  /**
   * Tạo field mới
   * @param name Tên field
   * @param dataType Kiểu dữ liệu
   * @returns Field mới
   */
  public static createField(name: string, dataType: Field['dataType']): Field {
    const id = `field-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    return {
      id,
      name,
      dataType,
      displayName: name
    };
  }
}