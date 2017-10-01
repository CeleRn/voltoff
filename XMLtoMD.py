import xml.etree.cElementTree as ET
from xml.etree import ElementTree
import requests
import os
from transliterate import translit, get_available_language_codes

tree = ET.parse('products.xml')
root = tree.getroot()

root_dir = 'source'
goods_dir = '_goods'
slash = '\\'
try:
    os.mkdir(root_dir)
    os.chdir(root_dir)
except(FileExistsError):
    print('Каталог уже существует - ' + root_dir)
    os.chdir(root_dir)

# categories = root.iter('categories')
for categories in root.iter('categories'):
    categories = categories

def translit_string(string):
    tr_string = translit(string, 'ru', reversed=True).replace(".","").replace("*","").replace(",","").replace(" ","_").replace("'","").replace("\\","").replace("/","").replace("\"","").lower()
    return tr_string

def get_childs(element_id):
    list_of_childs = []
    for category in categories.iter('category'):
        if category.attrib.get('parentId') == element_id:
            dir_name = translit_string(category.text)
            list_of_childs = list_of_childs + [[category.attrib.get('id'), dir_name, category.text, get_childs(category.attrib.get('id')), category.attrib.get('parentId')]]
    return list_of_childs

current_level_id_list = []
for category in categories.iter('category'):   
    if not category.attrib.get('parentId'):
        dir_name = translit_string(category.text)
        current_level_id_list = current_level_id_list + [[category.attrib.get('id'), dir_name, category.text,get_childs(category.attrib.get('id')), category.attrib.get('parentId')]]



def mk_way(category_obj):
    dir_way = translit_string(category_obj.text) + slash
    # print(dir_way)
    if category_obj.attrib.get('parentId'):
        for parent in categories.iter('category'):
            if parent.attrib.get('id') == category_obj.attrib.get('parentId'):
                dir_way = mk_way(parent) + dir_way
    return dir_way

category_id_way = []
for category in categories.iter('category'):
    path = mk_way(category)
    category_id = category.attrib.get('id')
    category_id_way = category_id_way + [(category_id,path)]
category_id_way = dict(category_id_way)
print(category_id_way.get('53740'))

def create_index_file(params):
    file = open("index.md",'w',encoding='utf-8')
    file.write('---\n')
    file.write('id: ' + params[0]+ '\n')
    file.write('title: ' + params[1]+ '\n')
    file.write('parentId: ' + str(params[2])+ '\n')
    file.write('---\n')
    file.close

def mkDirsTree(dir_obj):
    dir_name = dir_obj[1]
    try:
        os.mkdir(dir_name)
        os.chdir(dir_name)

    except(FileExistsError):
        print('Каталог уже существует - ' + dir_name)
        os.chdir(dir_name)
    params = [dir_obj[0],dir_obj[2],dir_obj[4]]
    create_index_file(params)
    childs = dir_obj[3]
    for child in childs:
        mkDirsTree(child)
    os.chdir('..')

for category in current_level_id_list:
    print(category[1])
    mkDirsTree(category)




def create_md_file(offer_obj, category_id_way):
    offer = offer_obj
    if offer.find('vendor').text:
        if offer.find('model'):
            file_name = offer.find('vendor').text + "__" + offer.find('model').text
        else:
            file_name = offer.find('vendor').text + "__" + offer.find('vendorCode').text
    else:
        if not offer.find('model'):
            file_name = offer.find('vendorCode').text
        else:
            file_name = offer.find('model').text
    file_name = translit_string(file_name)
    file = open(file_name+".md",'w',encoding='utf-8')
    file.write('---\n')
    # file.write(': ' + offer.attrib)
    # file.write(': ' + offer.text)
    # file.write(': ' + offer.attrib)
    file.write('price: ' + offer.find('price').text + '\n')
    file.write('categoryId: ' + offer.find('categoryId').text + '\n')
    file.write('categoryPath: ' + category_id_way.get(offer.find('categoryId').text) + '\n')
    file.write('country_of_origin: ' + offer.find('country_of_origin').text + '\n')
    file.write('delivery: ' + offer.find('delivery').text + '\n')
    file.write('description: ' + offer.find('description').text + '\n')
    file.write('local_delivery_cost: ' + offer.find('local_delivery_cost').text + '\n')
    file.write('manufacturer_warranty: ' + offer.find('manufacturer_warranty').text + '\n')
    if offer.find('model'):
        if offer.find('model').text:
            file.write('model: ' + offer.find('model').text + '\n')
        else:
            file.write('model: null' + '\n')
    # file.write('model: ' + offer.find('model').text + '\n')
    file.write('modified_time: ' + offer.find('modified_time').text + '\n')
    file.write('name: ' + offer.find('name').text + '\n')
    # file.write('oldprice: ' + offer.find('oldprice').text + '\n')
    if offer.find('oldprice'):
        if offer.find('oldprice').text:
            file.write('oldprice: ' + offer.find('oldprice').text + '\n')
        else:
            file.write('oldprice: null' + '\n')
    file.write('price: ' + offer.find('price').text + '\n')
    # file.write('picture: ' + offer.find('picture').text + '\n')
    # r = requests.get(offer.find('picture').text, stream=True)
    # os.chdir('..')
    # try:
    #     os.mkdir('images')
    #     os.chdir('images')

    # except(FileExistsError):
    #     print('Каталог уже существует - ' + 'images')
    #     os.chdir('images')
    # if r.status_code == 200:
    #     with open(file_name+".jpg", 'wb') as f:
    #         for chunk in r:
    #             f.write(chunk)
    # os.chdir('../' + goods_dir)
    # file.write('typePrefix: ' + offer.find('typePrefix').text + '\n')
    if offer.find('typePrefix'):
        if offer.find('typePrefix').text:
            file.write('typePrefix: ' + offer.find('typePrefix').text + '\n')
        else:
            file.write('typePrefix: null' + '\n')
    file.write('url: ' + offer.find('url').text + '\n')
    # file.write('vendor: ' + offer.find('vendor').text + '\n')
    if offer.find('vendor'):
        if offer.find('vendor').text:
            file.write('vendor: ' + offer.find('vendor').text + '\n')
        else:
            file.write('vendor: null' + '\n')
    
    file.write('vendorCode: ' + offer.find('vendorCode').text + '\n')
    file.write('---\n')
    file.close()


list_of_offers = []

try:
    os.mkdir(goods_dir)
    os.chdir(goods_dir)

except(FileExistsError):
    print('Каталог уже существует - ' + goods_dir)
    os.chdir(goods_dir)
count_of_errors = 0
for offer in root.iter('offer'):
    # list_of_offers = list_of_offers + offer
    try:
        create_md_file(offer, category_id_way)
    except Exception as error:
        print(offer.find('name').text)
        print(offer.find('categoryId').text)
        print(offer.find('url').text)
        print(category_id_way.get(offer.find('categoryId').text))
        print(str(error))
        count_of_errors += 1
        print(count_of_errors)
print('Епта.... ФИНИШ!!!')