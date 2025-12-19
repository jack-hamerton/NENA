import os
import sys
import runpy
from dotenv import load_dotenv

load_dotenv()
os.chdir('backend')
sys.path.insert(0, os.getcwd())
runpy.run_module('alembic', run_name='__main__', alter_sys=True)
