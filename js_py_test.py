import json # import the module of json
import sys # this module is used to get the params from cmd


def execute_opt(opt):
    return 0

def main():

    opt = sys.argv[1]
    #print("opt is " + opt)

    status = 'success'

    if execute_opt(opt) != 0:
        status = 'fail'

    #obj = json.loads(params) #str to obj
    ret_json = {"option":opt, "status":status}
    ret_str = json.dumps(ret_json,sort_keys=True)

    #return strjson to js
    print(ret_str)

main()